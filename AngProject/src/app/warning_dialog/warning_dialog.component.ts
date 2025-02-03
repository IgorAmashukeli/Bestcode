// dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog',
  standalone: true,
  templateUrl: './warning_dialog.component.html',
  styleUrls: ['./warning_dialog.component.css'],
  imports: [CommonModule],
})
export class WarningDialogComponent implements OnInit {
  currentRoute: string = '';
  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<WarningDialogComponent>,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
