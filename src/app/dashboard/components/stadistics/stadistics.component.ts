import { Component, Input, ViewChild } from '@angular/core';
import moment from 'moment';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Route } from 'src/app/interfaces';
export interface ChartInfo {
  title: string;
  data: Route[];
  format: 'D' | 'dddd, D' | 'DD/MM' | 'MMMM' | 'YYYY';
}
@Component({
  selector: 'app-stadistics',
  templateUrl: './stadistics.component.html',
  styleUrls: ['./stadistics.component.css'],
})
export class StadisticsComponent {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  @Input() routes: Route[] = [];
  @Input() needAvg: boolean = false;

  chartData: ChartConfiguration['data'] = {
    datasets: [],
    labels: [],
  };

  chartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      x: {},
      y: {
        beginAtZero: true,
        position: 'left',
        grid: {
          color: '#A0A0A0',
        },
        ticks: {
          color: '#1d273b',
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Estadísticas',
        color: '#1d273b',
      },
    },
  };

  chartType: ChartType = 'line';

  updateChart({ title, data, format }: ChartInfo) {
    this.chartOptions!.plugins!.title!.text = title;
    this.chartData = {
      datasets: [
        {
          label: 'Distancia(km)',
          data: data.map((route) => route.distance),
          borderColor: 'rgba(0, 0, 255, 0.3)',
          backgroundColor: 'rgba(0, 0, 255, 0.3)',
        },
        {
          label: 'Tiempo Recorrido(min)',
          data: data.map((route) => route.timeElapsed),
          borderColor: 'rgba(255, 0, 0, 0.3)',
          backgroundColor: 'rgba(255, 0, 0, 0.3)',
        },
        {
          label: 'Calorías Quemadas(kcal)',
          data: data.map((route) => route.burnoutCalories),
          borderColor: 'rgba(255, 0, 0, 0.3)',
          backgroundColor: 'rgba(255, 0, 0, 0.3)',
        },
      ],
      labels: this.getLabelsFromData(data, format),
    };
    this.chart?.update();
  }

  getLabelsFromData(
    data: Route[],
    format: 'D' | 'dddd, D' | 'DD/MM' | 'MMMM' | 'YYYY'
  ) {
    return data.map((route) =>
      this.toTitleCase(moment(route.startDate).locale('es').format(format))
    );
  }

  toTitleCase(value: string) {
    return value.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
  }
}
