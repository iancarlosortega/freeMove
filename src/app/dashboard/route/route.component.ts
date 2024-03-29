import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { RouteService } from 'src/app/services';
import { Route } from 'src/app/interfaces';
import { mapRoute } from 'src/app/utils';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css'],
})
export class RouteComponent implements OnInit {
  route!: Route;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private routeService: RouteService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.routeService.getRouteById(id)))
      .subscribe((route) => {
        if (!route) {
          this.router.navigateByUrl('/dashboard');
          return;
        }
        this.route = mapRoute(route);
      });
  }
}
