import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AngularSplitModule } from 'angular-split';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'right-workspace',
  standalone: true,
  imports: [AngularSplitModule, MonacoEditorModule, FormsModule, CommonModule],
  templateUrl: './right-workspace.component.html',
  styleUrls: ['./right-workspace.component.css'],
})
export class RightWorkSpaceComponent implements OnInit, OnChanges {
  @Input() selectedLanguage: string = '';
  @Input() mathResponse: string = '';
  @Input() programmingResponse: string = '';
  @Input() OK: boolean = false;
  @Input() WA: boolean = false;
  @Input() status: string = '';
  @Input() show_tests: boolean = true;
  @Input() test_case_wa_run: number = -1;
  @Input() input_wa_run: string = '';
  @Input() output_wa_run: string = '';
  @Input() your_output_wa_run: string = '';
  @Input() proof_loading: Observable<boolean> = of(true);
  @Input() code_loading: Observable<boolean> = of(true);
  @Input() submit_not_run: boolean = true;

  code_languages: Array<Array<string>> = [[]];
  initial_codes: any = {};
  initial_language: string = '';
  example_array: Array<string> = [];
  course_type: boolean = false;

  previous_language: string = '';
  routeKey: string = '';

  selectedCase: number = 0;

  cur_code: string = this.initial_codes[this.initial_language];
  constructor(
    private router: Router,
    private dataService: DataService,
    public authService: AuthService
  ) {
    this.routeKey = this.router.url;
  }

  assign_fields(problem: any): void {
    this.code_languages = problem['languages'];
    this.initial_codes = problem['initial_codes'];
    this.initial_language = problem['initial_language'];
    this.selectedLanguage = this.initial_language;
    this.example_array = problem['examples'];
    this.previous_language = this.initial_language;
  }

  ngOnInit() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const _ = localStorage.getItem(this.routeKey);
      const splited: any = this.router.url.split('/');
      const course = splited[1];
      this.course_type = course == 'math';
      const topic = splited[2];
      const problemId = +splited[3];
      this.dataService.fetchProblemData(course, topic, problemId).subscribe({
        next: (problem: any[]) => {
          this.assign_fields(problem[0]);
          const _ = localStorage.getItem(this.routeKey);
          this.cur_code = this.initial_codes[this.initial_language];

          window.addEventListener(
            'beforeunload',
            this.saveCodesToLocalStorage.bind(this)
          );
        },
        error: (error: any) => {
          console.error('Error fetching problem:', error);
        },
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['selectedLanguage'] &&
      !changes['selectedLanguage'].firstChange
    ) {
      if (typeof localStorage !== 'undefined') {
        const storedCodes = localStorage.getItem(this.routeKey);
        this.initial_codes = storedCodes
          ? JSON.parse(storedCodes)
          : this.initial_codes;

        if (
          this.selectedLanguage &&
          this.initial_codes[this.selectedLanguage]
        ) {
          this.initial_codes[this.previous_language] = this.cur_code;
        }
        localStorage.setItem(this.routeKey, JSON.stringify(this.initial_codes));

        this.cur_code = this.initial_codes[this.selectedLanguage];

        this.previous_language = this.selectedLanguage;
      }
    }
  }

  saveCodesToLocalStorage() {
    this.initial_codes[this.selectedLanguage] = this.cur_code;
    localStorage.setItem(this.routeKey, JSON.stringify(this.initial_codes));
  }

  changeSelectedCase(case_number: number) {
    this.selectedCase = case_number;
  }

  parseInputOutput(inputOutputString: string) {
    const inputMatch = inputOutputString.match(
      /<b><b>Input<\/b><\/b>: (.*?)<br>/
    );
    const outputMatch = inputOutputString.match(
      /<b><b>Output<\/b><\/b>: (.*?)<br>/
    );
    const explanationMatch = inputOutputString.match(
      /<b><b>Explanation<\/b><\/b>: (.*?)$/
    );

    const input = inputMatch ? inputMatch[1].trim() : '';
    const output = outputMatch ? outputMatch[1].trim() : '';
    const explanation = explanationMatch ? explanationMatch[1].trim() : '';

    return { inp: input, outp: output };
  }

  ngOnDestroy() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      window.removeEventListener(
        'beforeunload',
        this.saveCodesToLocalStorage.bind(this)
      );
    }
  }
}
