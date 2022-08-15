import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class NewUserGuard implements CanActivate, CanLoad {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.getAuthState().pipe(
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigate(['/auth'], {
            state: { redirect: this.router.url },
          });
        }
      })
    );
  }

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.getAuthState().pipe(
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigate(['/auth'], {
            state: { redirect: this.router.url },
          });
        }
      })
    );
  }
}
