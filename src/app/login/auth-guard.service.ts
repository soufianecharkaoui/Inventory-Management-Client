import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  isLoggedIn: boolean;

  constructor(public authService: AuthService, public router: Router) { }

  canActivate(): boolean {
    this.authService.isAuthenticated
      .subscribe(isAuthenticated => {
        this.isLoggedIn = isAuthenticated;
        if (!this.isLoggedIn) {
          this.router.navigate(['login']);
        }
      });
      return this.isLoggedIn;
  }
}
