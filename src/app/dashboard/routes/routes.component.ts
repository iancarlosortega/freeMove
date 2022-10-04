import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, switchMap, tap } from 'rxjs';
import { RouteService, UserService } from 'src/app/services';
import { Route } from 'src/app/interfaces';
import { ConfirmDeleteComponent } from '../components/confirm-delete/confirm-delete.component';
import { mapRoute } from 'src/app/utils';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css'],
})
export class RoutesComponent implements OnInit, OnDestroy {
  userObs!: Subscription;
  routes: Route[] = [];
  routesAux: Route[] = [];
  idUser: string = '';
  isLoading: boolean = true;

  constructor(
    public dialog: MatDialog,
    private routeService: RouteService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userObs = this.userService.user$
      .pipe(
        tap((user) => (this.idUser = user.idUser)),
        switchMap((user) => this.routeService.getRoutesByUser(user.idUser))
      )
      .subscribe((routes) => {
        this.routes = routes.map((route: Route) => mapRoute(route));
        this.routesAux = routes;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.userObs.unsubscribe();
  }

  deleteRoute(id: string) {
    const dialog = this.dialog.open(ConfirmDeleteComponent, {
      width: '400px',
    });

    dialog.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.routeService.deleteRoute(id);
      }
    });
  }

  deleteAllRoutes() {
    const dialog = this.dialog.open(ConfirmDeleteComponent, {
      width: '400px',
    });
    dialog.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.routeService.deleteRoutesByUser(this.idUser);
      }
    });
  }

  filterRoutes(event: any) {
    const value = event.target.value.toLowerCase().trim();
    this.routes = this.routesAux.filter((route) =>
      this.removeAccents(route.name.toLowerCase()).includes(value)
    );
  }

  removeAccents(text: string) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
