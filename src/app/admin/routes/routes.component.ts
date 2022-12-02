import { AfterViewInit, Component } from '@angular/core';
import { switchMap, tap } from 'rxjs';
import { Incident, Route } from 'src/app/interfaces';
import { IncidentService, RouteService } from 'src/app/services';
import { mapRoute } from 'src/app/utils';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css'],
})
export class RoutesComponent implements AfterViewInit {
  routes: Route[] = [];
  incidents: Incident[] = [];
  totalDistance: number = 0;
  isLoading: boolean = true;

  constructor(
    private routeService: RouteService,
    private incidentService: IncidentService
  ) {}

  ngAfterViewInit(): void {
    this.routeService
      .getRoutes()
      .pipe(
        tap((routes) => (this.routes = routes.map((route) => mapRoute(route)))),
        switchMap(() => this.incidentService.getIncidents())
      )
      .subscribe((incidents) => {
        // Calculate the total distance of all routes
        this.totalDistance = this.routes.reduce((total, route) => {
          if (route.distance) {
            return total + route.distance;
          } else {
            return total;
          }
        }, 0);
        this.incidents = incidents;
        this.isLoading = false;
      });
  }
}
