import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { DialogService } from '../services/dialog.service';
import { SolutionDialogComponent } from '../solution_dialog/solution_dialog.component';
import { AuthService } from '../services/auth.service';
import { NavigationBarComponent } from '../navigation_bar/navigation_bar.component';
import { DataService } from '../services/data.service';
import { Observable, Subject, of } from 'rxjs';
import { Auth, Unsubscribe, User } from '@angular/fire/auth';

@Component({
  selector: 'problems',
  standalone: true,
  templateUrl: './problems.component.html',
  styleUrls: ['./problems.component.css'],
  imports: [CommonModule, RouterLink, RouterLinkActive, NavigationBarComponent],
})
export class ProblemsComponent implements OnInit {
  course_title: string = '';
  course_type: string = '';
  course_id: number = -1;
  course_flag: boolean = true;
  problemArray: Array<any> = [];
  loading: Observable<boolean> = of(false);
  loading$ = new Subject<boolean>();
  user_statuses: Array<string> = [];
  authStateChangedSubscription!: Unsubscribe;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private dialogService: DialogService,
    public authService: AuthService,
    public auth: Auth,
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.course_type = this.router.url.split('/')[1];
    const course_route: string = this.router.url.split('/')[2];
    this.course_flag = this.course_type === 'math';
    this.course_title = this.route.snapshot.data['title'];
    this.loading$.next(true);
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.dataService
          .fetchProblemsData(this.course_type, course_route)
          .subscribe({
            next: (problem: any[]) => {
              this.dataService.fetchUserData(user.uid).subscribe({
                next: (usersInfo: any[]) => {
                  if (typeof usersInfo !== 'undefined') {
                    const user_problems = usersInfo[0]['problems'];
                    problem.forEach((item) => {
                      const key = item.key;
                      const status = user_problems[key]?.status;
                      if (status) {
                        this.user_statuses.push(status);
                      }
                    });
                  }
                },

                error: (error: any) => {
                  console.error('Error fetching user:', error);
                },
              });

              this.problemArray = problem;
              this.cdr.detectChanges();
              this.loading$.next(false);
            },
            error: (error: any) => {
              console.error('Error fetching problem:', error);
              this.cdr.detectChanges();
              this.loading$.next(false);
            },
          });
      } else {
        this.loading$.next(true);
        this.user_statuses = [];
        this.dataService
          .fetchProblemsData(this.course_type, course_route)
          .subscribe({
            next: (problem: any[]) => {
              this.problemArray = problem;
              this.cdr.detectChanges();
              this.loading$.next(false);
            },
            error: (error: any) => {
              console.error('Error fetching problem:', error);
              this.loading$.next(false);
            },
          });
      }
    });

    this.authStateChangedSubscription = this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.loading$.next(true);
        this.helper(user);
      } else {
        this.loading$.next(false);
      }
    });
  }

  helper(user: User) {
    this.dataService.fetchUserData(user.uid).subscribe({
      next: (usersInfo: any[]) => {
        if (typeof usersInfo !== 'undefined') {
          const user_problems = usersInfo[0]['problems'];
          this.problemArray.forEach((item) => {
            const key = item.key;
            const status = user_problems[key]?.status;
            if (status) {
              this.user_statuses.push(status);
            }
            this.loading$.next(false);
          });
        }
      },

      error: (error: any) => {
        console.error('Error fetching user:', error);
      },
    });
  }

  openSolutionDialog(video_id: string = 'y3svPgyGnLc') {
    this.dialogService.openDialog('1200px', '700px', SolutionDialogComponent, {
      video_id: video_id,
    });
  }
}
