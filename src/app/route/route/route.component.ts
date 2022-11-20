import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { RouteService } from 'src/app/services';
import { Route } from 'src/app/interfaces';
import { mapRoute } from 'src/app/utils';
import Mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

Mapboxgl.accessToken = environment.mapboxToken;

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css'],
})
export class RouteComponent implements OnInit {
  route!: Route;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private routeService: RouteService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.routeService.getRouteById(id)))
      .subscribe((route) => {
        if (!route) {
          this.router.navigateByUrl('/');
          return;
        }
        this.route = mapRoute(route);
      });
  }
}
