import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, switchMap, take, tap } from 'rxjs';
import SwiperCore from 'swiper';
import moment from 'moment';
import { ChartConfiguration } from 'chart.js';
import { RouteService, UserService } from 'src/app/services';
import { Route, User } from 'src/app/interfaces';
import { mapRoute } from 'src/app/utils';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  user: User = {
    idUser: '',
    name: '',
    email: '',
    role: 'ADMIN-ROLE',
    provider: 'email-password',
    weight: 0,
    height: 0,
    createdAt: new Date(),
    followers: [],
    following: [],
  };
  userObs!: Subscription;
  routes: Route[] = [];
  sliderRoutes: any[] = [];
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
  last7daysData: ChartConfiguration['data'] = {
    datasets: [],
    labels: [],
  };

  last15daysData: ChartConfiguration['data'] = {
    datasets: [],
    labels: [],
  };
  idealWeight: number = 0;
  firstRange: number = 0;
  secondRange: number = 0;

  constructor(
    private userService: UserService,
    private routeService: RouteService
  ) {}

  ngOnInit(): void {
    this.userObs = this.userService.user$
      .pipe(
        tap((user) => (this.user = user)),
        switchMap((user) => this.routeService.getRoutesByUser(user.idUser)),
        take(1)
      )
      .subscribe((routes) => {
        this.routes = routes.map((route) => mapRoute(route));
        routes.forEach((route) => {
          route.photos?.forEach((photo) => {
            this.sliderRoutes.push({
              idRoute: route.idRoute,
              name: route.name,
              photo: photo.photoUrl,
            });
          });
        });
        this.last7daysData = this.createChart(7);
        this.last15daysData = this.createChart(15);

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

        // Calcular el peso ideal
        if (this.user.gender !== 'Otro' && this.user.gender) {
          this.getIdealWeight(this.user.gender, this.user.height!);
        }
      });
  }

  ngOnDestroy(): void {
    this.userObs.unsubscribe();
  }

  createChart(daysAgo: number) {
    const data = this.getRoutesByDate(daysAgo);
    return {
      datasets: [
        {
          label: 'Distancia',
          data: data.map((route) => route.distance),
          borderColor: 'rgba(0, 0, 255, 0.3)',
          backgroundColor: 'rgba(0, 0, 255, 0.3)',
        },
        {
          label: 'Tiempo Recorrido',
          data: data.map((route) => route.timeElapsed),
          borderColor: 'rgba(255, 0, 0, 0.3)',
          backgroundColor: 'rgba(255, 0, 0, 0.3)',
        },
        {
          label: 'Calorías Quemadas',
          data: data.map((route) => route.burnoutCalories),
          borderColor: 'rgba(255, 0, 0, 0.3)',
          backgroundColor: 'rgba(255, 0, 0, 0.3)',
        },
      ],
      labels: this.getLabelsFromData(data),
    };
  }

  getRoutesByDate(daysAgo: number) {
    const data = this.reduceRoutes(this.routes);
    const result: Route[] = [];
    const dateStart = moment().subtract(daysAgo, 'days');
    const dateEnd = moment();

    while (dateEnd.diff(dateStart, 'days') >= 0) {
      if (
        data.find((route) => moment(route.startDate).isSame(dateStart, 'days'))
      ) {
        result.push(
          data.find((route) =>
            moment(route.startDate).isSame(dateStart, 'days')
          ) as Route
        );
      } else {
        result.push({
          distance: 0,
          burnoutCalories: 0,
          timeElapsed: 0,
          startDate: dateStart.toDate(),
        } as any);
      }
      dateStart.add(1, 'days');
    }
    return result;
  }

  reduceRoutes(routes: Route[]) {
    // Break reference with original routes
    const data: Route[] = JSON.parse(JSON.stringify(routes));

    return data.reduce((acc, route) => {
      const date = moment(route.startDate);
      const index = acc.findIndex((r) =>
        moment(r.startDate).isSame(date, 'days')
      );
      if (index === -1) {
        acc.push(route);
      } else {
        acc[index].distance += route.distance;
        acc[index].timeElapsed += route.timeElapsed;
        acc[index].burnoutCalories += route.burnoutCalories;
      }
      return acc;
    }, [] as Route[]);
  }

  getLabelsFromData(data: Route[]) {
    return data.map((route) =>
      this.toTitleCase(moment(route.startDate).locale('es').format('DD/MM'))
    );
  }

  toTitleCase(value: string) {
    return value.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
  }

  getIdealWeight(gender: string, height: number) {
    if (gender === 'Masculino') {
      this.idealWeight = height - 100 - (height - 150) / 4;
    } else {
      this.idealWeight = height - 100 - (height - 150) / 2.5;
    }

    this.firstRange = this.idealWeight - 6.2;
    this.secondRange = this.idealWeight + 7.3;
  }
}
