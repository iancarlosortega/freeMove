import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    console.log('Auth Guard');
    // const { redirect } = window.history.state;
    // console.log(redirect);
    return this.authService.checkDashState().pipe(
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    console.log('Auth Guard');
    // const { redirect } = window.history.state;
    // console.log(redirect);
    return this.authService.checkDashState().pipe(
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }
}
