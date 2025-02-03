// dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-dialog',
  standalone: true,
  templateUrl: './solution_dialog.component.html',
  styleUrls: ['./solution_dialog.component.css'],
  imports: [CommonModule],
})
export class SolutionDialogComponent implements OnInit {
  course_type: boolean = true;
  videoUrl: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { video_id: string },
    public dialogRef: MatDialogRef<SolutionDialogComponent>,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    if (this.router.url.split('/')[1] === 'programming') {
      this.course_type = false;
    }
  }

  ngOnInit(): void {
    if (this.data) {
      this.videoUrl = 'https://youtube.com/embed/' + this.data.video_id;
    }
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  transform() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);
  }
}
