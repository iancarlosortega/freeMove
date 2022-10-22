import { Component, Input, OnInit } from '@angular/core';
import { Route, User } from 'src/app/interfaces';

@Component({
  selector: 'app-dashboard-aside',
  templateUrl: './dashboard-aside.component.html',
  styleUrls: ['./dashboard-aside.component.css'],
})
export class DashboardAsideComponent implements OnInit {
  @Input() routes: Route[] = [];
  @Input() user!: User;

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
  idealWeight: number = 0;
  firstRange: number = 0;
  secondRange: number = 0;

  constructor() {}

  ngOnInit(): void {
    // Filtrar rutas del mes actual
    this.currentMonthRoutes = this.routes.filter((route) => {
      const routeDate = new Date(route.startDate);
      return (
        routeDate.getMonth() === this.currentDay.getMonth() &&
        routeDate.getFullYear() === this.currentDay.getFullYear()
      );
    });

    // Filtrar rutas del día actual
    this.currentDayRoutes = this.routes.filter((route) => {
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
