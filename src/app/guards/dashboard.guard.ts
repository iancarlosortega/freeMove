import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class DashboardGuard implements CanActivate, CanLoad {
  constructor(
    private router: Router,
    private authService: AuthService,
    private location: Location
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.checkAuthState().pipe(
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigate(['/auth'], {
            state: { redirect: this.location.path() },
          });
        }
      })
    );
  }

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.checkAuthState().pipe(
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigate(['/auth'], {
            state: { redirect: this.location.path() },
          });
        }
      })
    );
  }
}
