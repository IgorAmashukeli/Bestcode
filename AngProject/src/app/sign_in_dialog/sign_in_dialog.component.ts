// dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { Auth, User } from '@angular/fire/auth';
import { DataService } from '../services/data.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-dialog',
  standalone: true,
  templateUrl: './sign_in_dialog.component.html',
  styleUrls: ['./sign_in_dialog.component.css'],
  imports: [CommonModule],
})
export class SignInDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<SignInDialogComponent>,
    public authService: AuthService,
    public auth: Auth,
    private dataService: DataService
  ) {}

  ngOnInit(): void {}

  public closeDialog(): void {
    this.dialogRef.close();
  }

  async signInWithGoogle() {
    await this.authService.googleSignIn();
    this.closeDialog();
    const user = this.auth.currentUser;
    if (user) {
      const users = await firstValueFrom(
        this.dataService.fetchUserData(user.uid)
      );
      if (users.length === 0) {
        await this.createUserInfo(user.uid);
      }
    } else {
      console.error('Error creating user info');
    }
  }

  async createUserInfo(user_uid: string) {
    try {
      const response = await firstValueFrom(
        this.dataService.createUserData(user_uid)
      );
      console.log('User info created:', response);
    } catch (error) {
      console.error('Error creating user info:', error);
    }
  }

  signOut() {
    this.authService.googleSignOut();
    this.closeDialog();
  }
}
