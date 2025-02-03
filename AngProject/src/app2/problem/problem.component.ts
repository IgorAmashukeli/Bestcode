import {
  AfterContentChecked,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { AngularSplitModule } from 'angular-split';
import { LeftWorkspaceComponent } from '../left-workspace/left-workspace.component';
import { RightWorkSpaceComponent } from '../right-workspace/right-workspace.component';
import { NavigationBarComponent } from '../navigation_bar/navigation_bar.component';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DescriptionComponent } from '../description/description.component';
import { SubmissionsComponent } from '../submissions/submissions.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { DialogService } from '../services/dialog.service';
import { WarningDialogComponent } from '../warning_dialog/warning_dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from '../services/data.service';
import { Observable, firstValueFrom, of } from 'rxjs';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-problem',
  standalone: true,
  templateUrl: './problem.component.html',
  styleUrl: './problem.component.css',
  imports: [
    AngularSplitModule,
    LeftWorkspaceComponent,
    RightWorkSpaceComponent,
    NavigationBarComponent,
    MatToolbar,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    DescriptionComponent,
    SubmissionsComponent,
    FormsModule,
    HttpClientModule,
  ],
})
export class ProblemComponent implements AfterContentChecked {
  @ViewChild('navigationBar', { static: true }) navigationBar!: ElementRef;
  @ViewChild('toolbar', { static: true }) toolbar!: ElementRef;
  @ViewChild(RightWorkSpaceComponent)
  rightWorkSpaceComponent!: RightWorkSpaceComponent;

  course_type: string = '';
  course_id: number = -1;
  course_flag: boolean = true;

  selectedNavItem: string = 'description_page';
  parent_route: string = '';
  language_array: Array<Array<string>> = [];
  selectedLanguage: string = 'cpp';
  initial_codes: any = {};
  initial_language: string = '';
  example_array: Array<string> = [];
  window_object: any;
  splitHeight: string = '0px';
  math_response: string = '';
  programming_response: string = '';
  OK: boolean = false;
  WA: boolean = false;
  submit_not_run: boolean = false;
  status: string = '';
  show_tests: boolean = true;
  proof_loading: Observable<boolean> = of(true);
  code_loading: Observable<boolean> = of(true);
  loading_submission = true;
  test_case_wa_run: number = -1;
  input_wa_run: string = '';
  output_wa_run: string = '';
  your_output_wa_run: string = '';

  assign_fields(problem: any): void {
    this.language_array = problem['languages'];
    this.initial_codes = problem['initial_codes'];
    this.initial_language = problem['initial_language'];
    this.selectedLanguage = this.initial_language;
    this.example_array = problem['examples'];
  }

  constructor(
    private router: Router,
    private auth: Auth,
    public authService: AuthService,
    public dialogService: DialogService,
    public dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const navigationBarHeight = this.navigationBar.nativeElement.offsetHeight;
    const toolbarHeight = this.toolbar.nativeElement.offsetHeight;
    if (typeof window !== 'undefined') {
      this.splitHeight =
        window.innerHeight - 20 - (navigationBarHeight + toolbarHeight) + 'px';
    }
  }

  ngOnInit() {
    this.selectedNavItem = 'description_page';
    this.parent_route = this.router.url.split('/').slice(0, -1).join('/');
    const splited: any = this.router.url.split('/');
    const course = splited[1];
    this.course_flag = course == 'math';
    const topic = splited[2];
    const problemId = +splited[3];
    this.dataService.fetchProblemData(course, topic, problemId).subscribe({
      next: (problem: any[]) => {
        this.assign_fields(problem[0]);
        if (typeof window !== 'undefined') {
          this.window_object = window;
        }
      },
      error: (error: any) => {
        console.error('Error fetching problem:', error);
      },
    });
  }

  ngAfterContentChecked() {
    const navigationBarHeight = this.navigationBar.nativeElement.offsetHeight;
    const toolbarHeight = this.toolbar.nativeElement.offsetHeight;
    if (typeof window !== 'undefined') {
      this.splitHeight =
        window.innerHeight - 20 - (navigationBarHeight + toolbarHeight) + 'px';
    }
  }

  selectNavItem(item: string) {
    this.selectedNavItem = item;
  }

  submitNotSignedIn(button_type: number) {
    this.dialogService.openDialog(
      '60%',
      '55%',
      WarningDialogComponent,
      button_type
    );
  }

  async submit() {
    this.loading_submission = false;
    if (this.course_flag) {
      this.proof_loading = of(false);
      const code = this.rightWorkSpaceComponent.cur_code;
      const json_response = await firstValueFrom(
        this.dataService.submitMath(
          this.router.url.split('/')[2],
          this.router.url.split('/')[3],
          code
        )
      );
      this.math_response = json_response['log'];
      this.OK = this.math_response.startsWith('OK!');
      const user = this.auth.currentUser;
      if (user) {
        if (this.OK) {
          const _ = await firstValueFrom(
            this.dataService.solveProblem(
              user.uid,
              this.router.url.split('/')[1],
              this.router.url.split('/')[2],
              this.router.url.split('/')[3]
            )
          );
        }

        const _ = await firstValueFrom(
          this.dataService.addSubmissions(
            {
              code: json_response['code'],
              time: json_response['time'],
              status: json_response['status'],
              log: json_response['log'],
            },
            user.uid,
            this.router.url.split('/')[1],
            this.router.url.split('/')[2],
            this.router.url.split('/')[3]
          )
        );

        this.loading_submission = true;
        if (this.selectedNavItem == 'description_page') {
          this.selectNavItem('submissions_page');
        } else {
        }

        this.proof_loading = of(true);
      }
    } else {
      this.submit_not_run = true;
      this.code_loading = of(false);
      const code = this.rightWorkSpaceComponent.cur_code;
      const json_response = await firstValueFrom(
        this.dataService.submitProgramming(
          this.router.url.split('/')[2],
          this.router.url.split('/')[3],
          code
        )
      );
      this.OK = json_response['status'] == 'OK';
      this.WA = json_response['status'] == 'WA';
      this.status = json_response['status'];
      this.show_tests = false;
      this.programming_response = json_response['log'];
      if (this.status == 'OK') {
        this.programming_response = 'OK! All tests passed.';
      } else if (this.status == 'WA') {
        this.test_case_wa_run = parseInt(json_response['test_case'], 10) + 1;
        this.input_wa_run = json_response['input'];
        this.output_wa_run = json_response['correctOutput'];
        this.your_output_wa_run = json_response['yourOutput'];
      }
      console.log(json_response);
      const user = this.auth.currentUser;
      if (user) {
        if (this.OK) {
          const _ = await firstValueFrom(
            this.dataService.solveProblem(
              user.uid,
              this.router.url.split('/')[1],
              this.router.url.split('/')[2],
              this.router.url.split('/')[3]
            )
          );
        }
        const _ = await firstValueFrom(
          this.dataService.addSubmissions(
            {
              code: json_response['code'],
              time: json_response['time'],
              status: json_response['status'],
              runtime: json_response['runtime'],
              log: json_response['log'],
            },
            user.uid,
            this.router.url.split('/')[1],
            this.router.url.split('/')[2],
            this.router.url.split('/')[3]
          )
        );
      }

      this.loading_submission = true;
      if (this.selectedNavItem == 'description_page') {
        this.selectNavItem('submissions_page');
      } else {
      }

      this.loading_submission = true;
      this.code_loading = of(true);
    }
  }

  async run() {
    this.submit_not_run = false;

    this.code_loading = of(false);
    const code = this.rightWorkSpaceComponent.cur_code;
    const json_response = await firstValueFrom(
      this.dataService.runProgramming(
        this.router.url.split('/')[2],
        this.router.url.split('/')[3],
        code
      )
    );
    this.OK = json_response['status'] == 'OK';
    this.WA = json_response['status'] == 'WA';
    this.status = json_response['status'];
    console.log(this.status);
    this.show_tests =
      this.status !== 'OK' &&
      this.status !== 'RE' &&
      this.status != 'CE' &&
      this.status != 'TL';
    this.programming_response = json_response['log'];
    if (this.status == 'OK') {
      this.programming_response =
        'OK! All example tests passed. You can try to submit';
      this.status = 'Example tests passed';
    } else if (this.status == 'WA') {
      this.test_case_wa_run = json_response['test_case'];
      this.rightWorkSpaceComponent.selectedCase = this.test_case_wa_run;
      this.your_output_wa_run = json_response['yourOutput'];
    }
    this.code_loading = of(true);
  }
}
