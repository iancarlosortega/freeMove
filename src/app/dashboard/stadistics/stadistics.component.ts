import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs';
import { Route } from 'src/app/interfaces';
import { RouteService, UserService } from 'src/app/services';
import { mapRoute } from 'src/app/utils';

@Component({
  selector: 'app-stadistics',
  templateUrl: './stadistics.component.html',
  styleUrls: ['./stadistics.component.css'],
})
export class StadisticsComponent implements OnInit {
  routes: Route[] = [];
  isLoading: boolean = true;

  constructor(
    private userService: UserService,
    private routeService: RouteService
  ) {}

  ngOnInit(): void {
    this.userService.user$
      .pipe(switchMap((user) => this.routeService.getRoutesByUser(user.idUser)))
      .subscribe((routes) => {
        this.routes = routes.map((route) => mapRoute(route));
        this.isLoading = false;
      });
  }
}
