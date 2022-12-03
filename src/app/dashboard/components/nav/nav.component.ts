import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, switchMap, tap } from 'rxjs';
import {
  AuthService,
  NotificationService,
  UserService,
} from 'src/app/services';
import { Notification, Route, User } from 'src/app/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit, OnDestroy {
  user!: User;
  userObs!: Subscription;
  photoUrl: string = '';
  notifications: Notification[] = [];
  messages: any[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.userObs = this.userService.user$
      .pipe(
        tap((user) => {
          this.user = user;
          this.photoUrl = user.photoUrl || 'assets/no-image.png';
        }),
        switchMap((user) =>
          this.notificationService.getNotificationsByUser(user.idUser)
        )
      )
      .subscribe((notifications) => {
        this.notifications = notifications;
      });
  }

  ngOnDestroy(): void {
    this.userObs.unsubscribe();
  }

  search(event: any) {
    this.router.navigate(['/dashboard/buscar'], {
      queryParams: { q: event.target.value },
    });
  }

  navigateTo(notification: Notification) {
    if (notification.url) {
      this.router.navigateByUrl(
        `/dashboard/${notification.url}/${notification.idAlert}`
      );
      return;
    }
    this.router.navigateByUrl('/dashboard/notificaciones');
  }

  logout() {
    this.authService.logout();
  }
}
