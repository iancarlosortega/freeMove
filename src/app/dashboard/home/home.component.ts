import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, switchMap } from 'rxjs';
import { Route } from 'src/app/interfaces';
import { RouteService, UserService } from 'src/app/services';
import SwiperCore, { Autoplay } from 'swiper';
SwiperCore.use([Autoplay]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  //TODO: Eliminar estas imágenes
  photos = [
    {
      src: 'assets/test/1.jpg',
      alt: '',
    },
    {
      src: 'assets/test/2.jpg',
      alt: '',
    },
    {
      src: 'assets/test/3.jpg',
      alt: '',
    },
    {
      src: 'assets/test/4.webp',
      alt: '',
    },
  ];

  currentDay = new Date();
  currentDayRoutes: Route[] = [];
  currentMonthRoutes: Route[] = [];
  monthStadistics = {
    distanceTraveled: 0,
    burnoutCalories: 0,
    numberOfRoutes: 0,
  };
  dayStadistics = {
    distanceTraveled: 0,
    burnoutCalories: 0,
    numberOfRoutes: 0,
  };
  userObs!: Subscription;

  constructor(
    private userService: UserService,
    private routeService: RouteService
  ) {}

  ngOnInit(): void {
    this.userObs = this.userService.user$
      .pipe(switchMap((user) => this.routeService.getRoutesByUser(user.idUser)))
      .subscribe((routes) => {
        // Filtrar rutas del mes actual
        this.currentMonthRoutes = routes.filter((route) => {
          const routeDate = new Date(route.startDate);
          return (
            routeDate.getMonth() === this.currentDay.getMonth() &&
            routeDate.getFullYear() === this.currentDay.getFullYear()
          );
        });

        // Filtrar rutas del día actual
        this.currentDayRoutes = routes.filter((route) => {
          const routeDate = new Date(route.startDate);
          return (
            routeDate.getDate() === this.currentDay.getDate() &&
            routeDate.getMonth() === this.currentDay.getMonth() &&
            routeDate.getFullYear() === this.currentDay.getFullYear()
          );
        });

        // Obtener las estadísticas del mes
        this.monthStadistics.distanceTraveled = this.currentMonthRoutes.reduce(
          (prev, current) => current.distance + prev,
          0
        );

        this.monthStadistics.burnoutCalories = this.currentMonthRoutes.reduce(
          (prev, current) => current.burnoutCalories + prev,
          0
        );

        this.monthStadistics.numberOfRoutes = this.currentMonthRoutes.length;

        // Obtener las estadísticas del día
        this.dayStadistics.distanceTraveled = this.currentDayRoutes.reduce(
          (prev, current) => current.distance + prev,
          0
        );

        this.dayStadistics.burnoutCalories = this.currentDayRoutes.reduce(
          (prev, current) => current.burnoutCalories + prev,
          0
        );

        this.dayStadistics.numberOfRoutes = this.currentDayRoutes.length;
      });
  }

  ngOnDestroy(): void {
    this.userObs.unsubscribe();
  }
}
