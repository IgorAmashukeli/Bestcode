import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from '../services/data.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'description',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './description.component.html',
  styleUrl: './description.component.css',
})
export class DescriptionComponent implements OnInit {
  course_type: string = '';
  course_id: number = -1;
  course_flag: boolean = true;
  problem_name: string = '';
  problem_difficulty: string = '';
  accepted: number = 0;
  submitted: number = 0;
  acceptance_rate: number = 100;
  description_text: string = '';
  examples: Array<string> = [];
  constraints: Array<string> = [];
  note: string = '';
  loading: Observable<boolean> = of(false);

  assign_fields(problem: any): void {
    this.problem_name = problem['title'];
    this.problem_difficulty = problem['difficulty'];
    this.accepted = problem['accepted'];
    this.submitted = problem['submitted'];
    if (this.submitted != 0) {
      const acceptance_rate_not_rounded =
        (this.accepted / this.submitted) * 100;
      this.acceptance_rate = parseFloat(acceptance_rate_not_rounded.toFixed(2));
    }
    this.description_text = problem['description_text'];
    this.examples = problem['examples'];
    this.constraints = problem['constraints'];
    this.note = problem['note'];
  }

  extractSubstring(input: string) {
    return input.split('/').slice(0, 3).join('/');
  }

  constructor(
    private router: Router,
    private sanitizer: DomSanitizer,
    public dataService: DataService
  ) {}

  ngOnInit(): void {
    const splited: any = this.router.url.split('/');
    const course = splited[1];
    const topic = splited[2];
    const problemId = +splited[3];
    this.dataService.fetchProblemData(course, topic, problemId).subscribe({
      next: (problem: any[]) => {
        this.assign_fields(problem[0]);
        this.loading = of(true);
      },
      error: (error: any) => {
        console.error('Error fetching problem:', error);
        this.loading = of(true);
      },
    });
  }

  sanitizeHTML(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
