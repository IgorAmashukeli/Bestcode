import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateFn,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { VariablesService } from './variables.service';

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const variable = inject(VariablesService);
  if (authService.isLoggedIn()) {
    variable.changePopUp(false);
    return true;
  } else {
    variable.changePopUp(true);
    return router.createUrlTree(['/']);
  }
};
