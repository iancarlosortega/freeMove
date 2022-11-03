import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import moment from 'moment';
import { Route } from 'src/app/interfaces';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css'],
})
export class ChartsComponent implements OnInit {
  @Input() routes: Route[] = [];

  last7daysData: ChartConfiguration['data'] = {
    datasets: [],
    labels: [],
  };

  last15daysData: ChartConfiguration['data'] = {
    datasets: [],
    labels: [],
  };

  constructor() {}

  ngOnInit(): void {
    this.last7daysData = this.createChart(7);
    this.last15daysData = this.createChart(15);
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
}
