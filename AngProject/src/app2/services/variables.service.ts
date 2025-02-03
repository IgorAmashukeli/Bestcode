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
export class VariablesService {
  pop_up = false;
  constructor() {}

  public changePopUp(value: boolean) {
    this.pop_up = value;
  }

  public get_pop_up(): boolean {
    return this.pop_up;
  }
}
