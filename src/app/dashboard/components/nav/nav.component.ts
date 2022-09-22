import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, switchMap, tap } from 'rxjs';
import {
  AuthService,
  NotificationService,
  RouteService,
  UserService,
} from 'src/app/services';
import { Notification, Route, User } from 'src/app/interfaces';
import { Router } from '@angular/router';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit, OnDestroy {
  @ViewChild(MatAutocompleteTrigger) autocomplete!: MatAutocompleteTrigger;
  user!: User;
  userObs!: Subscription;
  photoUrl: string = '';
  notifications: Notification[] = [];
  messages: any[] = [];
  routes: Route[] = [];
  filteredRoutes: Route[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private routeService: RouteService
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
        this.routeService.getRoutes().subscribe((routes) => {
          this.routes = routes;
        });
      });
  }

  ngOnDestroy(): void {
    this.userObs.unsubscribe();
  }

  search(event: any) {
    this.autocomplete.closePanel();
    this.router.navigate(['/dashboard/buscar'], {
      queryParams: { q: event.target.value },
    });
  }

  filterRoutes(event: any) {
    const value = event.target.value;
    if (value.length === 0) {
      this.filteredRoutes = [];
      return;
    }
    this.filteredRoutes = this.routes.filter(
      (route) =>
        route.name.toLowerCase().includes(value.toLowerCase().trim()) ||
        route.keywords?.includes(value.toLowerCase().trim())
    );
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
