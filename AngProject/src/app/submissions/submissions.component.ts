import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, Subject, firstValueFrom, of } from 'rxjs';
import { DataService } from '../services/data.service';
import { Auth, Unsubscribe } from '@angular/fire/auth';
import { AuthService } from '../services/auth.service';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'submissions',
  standalone: true,
  imports: [CommonModule, MonacoEditorModule, FormsModule],
  templateUrl: './submissions.component.html',
  styleUrl: './submissions.component.css',
})
export class SubmissionsComponent implements OnInit {
  course_type: boolean = false;
  OK : boolean = false;
  submission_code: string = '';
  submission_log : string = '';
  submissions_array = [];
  submission_language: string = '';
  loading$ = new Subject<boolean>();
  authStateChangedSubscription!: Unsubscribe;
  table_view: Observable<boolean> = of(true);
  code_view: Observable<boolean> = of(false);

  constructor(
    private router: Router,
    private dataService: DataService,
    private auth: Auth,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.course_type = router.url.split('/')[1] == 'math';
  }

  ngOnInit() {
    this.loading$.next(true);
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.dataService
          .fetchSubmissions(
            this.auth.currentUser!.uid,
            this.router.url.split('/')[1],
            this.router.url.split('/')[2],
            this.router.url.split('/')[3]
          )
          .subscribe({
            next: (subm_arr: []) => {
              this.submissions_array = subm_arr;
              this.cdr.detectChanges();
              this.loading$.next(false);
            },

            error: (error: any) => {
              console.error('Error fetching user:', error);
            },
          });
      } else {
        this.submissions_array = [];
        this.loading$.next(false);
      }
    });

    this.authStateChangedSubscription = this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.loading$.next(true);
        this.helper();
      }
    });
  }

  helper() {
    this.dataService
      .fetchSubmissions(
        this.auth.currentUser!.uid,
        this.router.url.split('/')[1],
        this.router.url.split('/')[2],
        this.router.url.split('/')[3]
      )
      .subscribe({
        next: (subm_array: []) => {
          this.submissions_array = subm_array;
          this.cdr.detectChanges();
          this.loading$.next(false);
        },

        error: (error: any) => {
          console.error('Error fetching user:', error);
        },
      });
  }

  open_proof(index: number) {
    this.submission_language = 'lean';
    this.submission_code = this.submissions_array[index]['code'];
    this.table_view = of(false);
    this.code_view = of(true);
  }

  open_code(index : number) {
    this.submission_language = 'cpp';
    this.submission_code = this.submissions_array[index]['code'];
    this.table_view = of(false);
    this.code_view = of(true);
  }

  open_log(index : number) {
    this.table_view = of(false);
    this.code_view = of(false);
    this.submission_log = this.submissions_array[index]['log'];
    this.OK = this.submission_log.startsWith('OK!');
  }

  close_log() {
    this.table_view = of(true);
  }

  close_proof() {
    this.table_view = of(true);
    this.code_view = of(false);
  }
}
