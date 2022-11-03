import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, switchMap, take, tap } from 'rxjs';
import firebase from '@firebase/app-compat';
import { IncidentService, RouteService, UserService } from 'src/app/services';
import { Incident, Route, User } from 'src/app/interfaces';
import { mapRoute } from 'src/app/utils';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  user: User = {
    idUser: '',
    name: '',
    email: '',
    role: 'CLIENT-ROLE',
    provider: 'email-password',
    weight: 0,
    height: 0,
    createdAt: firebase.firestore.Timestamp.now(),
    followers: [],
    following: [],
  };
  userObs!: Subscription;
  routes: Route[] = [];
  incidents: Incident[] = [];
  isLoading: boolean = true;

  constructor(
    private userService: UserService,
    private routeService: RouteService,
    private incidentService: IncidentService
  ) {}

  ngOnInit(): void {
    this.userObs = this.userService.user$
      .pipe(
        tap((user) => (this.user = user)),
        switchMap((user) => this.routeService.getRoutesByUser(user.idUser)),
        take(1),
        tap((routes) => (this.routes = routes.map((route) => mapRoute(route)))),
        switchMap((_) => this.incidentService.getIncidents())
      )
      .subscribe((incidents) => {
        this.incidents = incidents;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.userObs.unsubscribe();
  }
}
