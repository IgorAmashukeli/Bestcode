import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithRedirect,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { signInWithPopup } from 'firebase/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommonModule, DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLocalStorageAvailable = typeof localStorage !== 'undefined';
  loggedIn = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedIn.asObservable();

  constructor(public fireauth: Auth, private router: Router) {
    this.fireauth.onAuthStateChanged((user) => {
      if (user) {
        this.loggedIn.next(true);
      } else {
        this.loggedIn.next(false);
      }
    });
  }

  googleSignIn() {
    return signInWithPopup(this.fireauth, new GoogleAuthProvider()).then(
      (res) => {
        const currentUrl = this.router.url;
        this.router.navigate([currentUrl]);
        if (this.isLocalStorageAvailable) {
          localStorage.setItem('token', JSON.stringify(res.user?.uid));
        }
      },
      (err) => {
        alert('Sign in was unsuccessful');
      }
    );
  }

  googleSignOut() {
    this.fireauth.signOut().then(
      () => {
        if (this.isLocalStorageAvailable) {
          localStorage.removeItem('token');
        }
        const currentUrl = this.router.url;
        this.router.navigate([currentUrl]);
      },
      (err) => {
        alert('Sign in was successful');
      }
    );
  }

  public isLoggedIn(): boolean {
    if (this.isLocalStorageAvailable) {
      const token = JSON.parse(localStorage.getItem('token')!);
      return token !== null && token.emailVerified !== false ? true : false;
    } else {
      return false;
    }
  }
}
