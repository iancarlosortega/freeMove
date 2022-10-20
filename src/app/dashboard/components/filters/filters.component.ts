import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import moment, { unitOfTime } from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { ChartInfo } from '../stadistics/stadistics.component';
import { Route } from 'src/app/interfaces';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css'],
})
export class FiltersComponent implements OnInit {
  @Output() updateRoutes: EventEmitter<ChartInfo> = new EventEmitter();
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

  filterGraphByDays() {
    const startDay = moment().add(-this.selectedDays, 'days').toDate();
    const endDay = moment().toDate();
    const title = `Últimos ${this.selectedDays} días`;

    this.getRoutesByDate(title, 'days', 'dddd, D', startDay, endDay);
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

    this.getRoutesByDate(title, 'days', 'D', startOfMonth, endOfMonth);
  }

  filterGraphByMonthsRanges() {
    const title = `${this.toTitleCase(
      moment(this.selectedStartMonth).locale('es').format('MMMM')
    )} - ${this.toTitleCase(
      moment(this.selectedEndMonth).locale('es').format('MMMM')
    )}`;

    this.getRoutesByDate(
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

    this.getRoutesByDate(title, 'months', 'MMMM', startOfYear, endOfYear);
  }

  filterGraphByYearsRanges() {
    const title = `${moment(this.selectedStartYear).format('YYYY')} - ${moment(
      this.selectedEndYear
    ).format('YYYY')}`;

    this.getRoutesByDate(
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

    this.getRoutesByDate(
      title,
      'days',
      'DD/MM',
      this.selectedAdvancedDate[0],
      this.selectedAdvancedDate[1]
    );
  }

  getRoutesByDate(
    title: string,
    timeUnit: unitOfTime.DurationConstructor,
    format: 'D' | 'dddd, D' | 'DD/MM' | 'MMMM' | 'YYYY',
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
    this.updateRoutes.emit({
      title,
      data: result,
      format,
    });
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

  toTitleCase(value: string) {
    return value.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
  }
}
