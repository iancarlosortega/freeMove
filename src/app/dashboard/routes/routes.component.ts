import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, switchMap } from 'rxjs';
import { Route } from 'src/app/interfaces';
import { RouteService, UserService } from 'src/app/services';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css'],
})
export class RoutesComponent implements OnInit, OnDestroy {
  userObs!: Subscription;
  routes: Route[] = [];

  constructor(
    private routeService: RouteService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userObs = this.userService.user$
      .pipe(switchMap((user) => this.routeService.getRoutesByUser(user.idUser)))
      .subscribe((routes) => {
        this.routes = routes;
      });
  }

  ngOnDestroy(): void {
    this.userObs.unsubscribe();
  }
}
