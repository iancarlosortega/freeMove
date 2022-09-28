import { Component, Input, OnInit, ViewChild } from '@angular/core';
import moment, { unitOfTime } from 'moment';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Route } from 'src/app/interfaces';

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.css'],
})
export class BitacoraComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  @Input() routes: Route[] = [];
  @Input() needAvg: boolean = false;
  options = [
    {
      value: 7,
      name: 'Últimos 7 días',
    },
    {
      value: 15,
      name: 'Últimos 15 días',
    },
    {
      value: 30,
      name: 'Últimos 30 días',
    },
  ];

  selectedDays: number = 30;
  selectedYear: Date = new Date();
  selectedMonth: Date = new Date();

  selectedStartMonth: Date = moment().subtract(1, 'month').toDate();
  selectedEndMonth: Date = moment().subtract(1, 'day').toDate();

  selectedStartYear: Date = moment().subtract(1, 'years').toDate();
  selectedEndYear: Date = moment().toDate();

  selectedAdvancedDate: Date[] = [
    moment().subtract(1, 'month').toDate(),
    moment().toDate(),
  ];

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

  constructor(
    private primengConfig: PrimeNGConfig,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.filterGraphByDays();
  }

  ngAfterViewInit() {
    this.translateChange('es');
  }

  translateChange(lang: string) {
    this.translateService.use(lang);
    this.translateService
      .get('primeng')
      .subscribe((res) => this.primengConfig.setTranslation(res));
  }

  updateChart(
    title: string,
    timeUnit: unitOfTime.DurationConstructor,
    format: 'D' | 'dddd, D' | 'DD/MM' | 'MMMM' | 'YYYY',
    startDate: Date,
    endDate: Date
  ) {
    const data = this.getRoutesByDate(timeUnit, startDate, endDate);
    this.chartOptions!.plugins!.title!.text = title;
    this.chartData = {
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
      labels: this.getLabelsFromData(data, format),
    };
    this.chart?.update();
  }

  filterGraphByDays() {
    const startDay = moment().add(-this.selectedDays, 'days').toDate();
    const endDay = moment().toDate();

    const title = `Últimos ${this.selectedDays} días`;
    this.updateChart(title, 'days', 'dddd, D', startDay, endDay);
  }

  filterGraphByMonth() {
    const startOfMonth = moment(this.selectedMonth).startOf('month').toDate();
    const endOfMonth = moment(this.selectedMonth)
      .endOf('month')
      .subtract(1, 'day')
      .toDate();
    const title = `Mes de ${this.toTitleCase(
      moment(this.selectedMonth).locale('es').format('MMMM')
    )}`;
    this.updateChart(title, 'days', 'D', startOfMonth, endOfMonth);
  }

  filterGraphByMonthsRanges() {
    const title = `${this.toTitleCase(
      moment(this.selectedStartMonth).locale('es').format('MMMM')
    )} - ${this.toTitleCase(
      moment(this.selectedEndMonth).locale('es').format('MMMM')
    )}`;
    this.updateChart(
      title,
      'months',
      'MMMM',
      this.selectedStartMonth,
      this.selectedEndMonth
    );
  }

  filterGraphByYear() {
    const startOfYear = moment(this.selectedYear).startOf('year').toDate();
    const endOfYear = moment(this.selectedYear)
      .endOf('year')
      .subtract(1, 'month')
      .toDate();
    const title = `Año ${moment(this.selectedYear).format('YYYY')}`;
    this.updateChart(title, 'months', 'MMMM', startOfYear, endOfYear);
  }

  filterGraphByYearsRanges() {
    const title = `${moment(this.selectedStartYear).format('YYYY')} - ${moment(
      this.selectedEndYear
    ).format('YYYY')}`;

    this.updateChart(
      title,
      'years',
      'YYYY',
      this.selectedStartYear,
      this.selectedEndYear
    );
  }

  filterGraphByAdvancedDate() {
    const title = `${moment(this.selectedAdvancedDate[0]).format(
      'DD/MM/YYYY'
    )} - ${moment(this.selectedAdvancedDate[1]).format('DD/MM/YYYY')}`;
    this.updateChart(
      title,
      'days',
      'DD/MM',
      this.selectedAdvancedDate[0],
      this.selectedAdvancedDate[1]
    );
  }

  getRoutesByDate(
    timeUnit: unitOfTime.DurationConstructor,
    startDate: Date,
    endDate: Date
  ) {
    const data = this.reduceRoutesByTimeUnit(this.routes, timeUnit);
    const result: Route[] = [];
    const dateStart = moment(startDate);
    const dateEnd = moment(endDate);

    while (dateEnd.diff(dateStart, timeUnit) >= 0) {
      if (
        data.find((route) =>
          moment(route.startDate).isSame(dateStart, timeUnit)
        )
      ) {
        result.push(
          data.find((route) =>
            moment(route.startDate).isSame(dateStart, timeUnit)
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
      dateStart.add(1, timeUnit);
    }
    return result;
  }

  reduceRoutesByTimeUnit(
    routes: Route[],
    timeUnit: unitOfTime.DurationConstructor
  ) {
    // Break reference with original routes
    const data: Route[] = JSON.parse(JSON.stringify(routes));
    if (this.needAvg) {
      return data
        .reduce((acc, route) => {
          const date = moment(route.startDate);
          const index = acc.findIndex((r) =>
            moment(r.startDate).isSame(date, timeUnit)
          );
          if (index === -1) {
            route.count = 1;
            acc.push(route);
          } else {
            acc[index].distance += route.distance;
            acc[index].timeElapsed += route.timeElapsed;
            acc[index].burnoutCalories += route.burnoutCalories;
            acc[index].count ? acc[index].count!++ : (acc[index].count = 1);
          }
          return acc;
        }, [] as Route[])
        .map((route) => {
          route.distance = route.distance / route.count!;
          route.timeElapsed = route.timeElapsed / route.count!;
          route.burnoutCalories = route.burnoutCalories / route.count!;
          return route;
        });
    }

    return data.reduce((acc, route) => {
      const date = moment(route.startDate);
      const index = acc.findIndex((r) =>
        moment(r.startDate).isSame(date, timeUnit)
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
