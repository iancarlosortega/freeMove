import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, switchMap, tap } from 'rxjs';
import {
  AuthService,
  NotificationService,
  UserService,
} from 'src/app/services';
import { Notification, User } from 'src/app/interfaces';

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

  constructor(
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

  //TODO: Implementar el buscador
  search() {}

  logout() {
    this.authService.logout();
  }
}
