import { Component, Input, OnInit } from '@angular/core';
import { Route } from 'src/app/interfaces';

@Component({
  selector: 'app-stadistics-card',
  templateUrl: './stadistics-card.component.html',
  styleUrls: ['./stadistics-card.component.css'],
})
export class StadisticsCardComponent implements OnInit {
  @Input() routes: Route[] = [];

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

  constructor() {}

  ngOnInit(): void {
    // Filtrar rutas del mes actual
    this.currentMonthRoutes = this.routes.filter((route) => {
      const routeDate = route.startDate;
      return (
        routeDate.getMonth() === this.currentDay.getMonth() &&
        routeDate.getFullYear() === this.currentDay.getFullYear()
      );
    });

    // Filtrar rutas del día actual
    this.currentDayRoutes = this.routes.filter((route) => {
      const routeDate = route.startDate;
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
  }
}
