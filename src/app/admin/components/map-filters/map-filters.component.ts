import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import moment, { unitOfTime } from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-map-filters',
  templateUrl: './map-filters.component.html',
  styleUrls: ['./map-filters.component.css'],
})
export class MapFiltersComponent implements AfterViewInit {
  @Output() updateData: EventEmitter<any[]> = new EventEmitter();
  @Input() data: any[] = [];

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

  ngAfterViewInit() {
    this.translateChange('es');
  }

  translateChange(lang: string) {
    this.translateService.use(lang);
    this.translateService
      .get('primeng')
      .subscribe((res) => this.primengConfig.setTranslation(res));
  }

  filterDataByDays() {
    const startDay = moment().add(-this.selectedDays, 'days').toDate();
    const endDay = moment().toDate();
    this.getDataByDate('days', startDay, endDay);
  }

  filterDataByMonth() {
    const startOfMonth = moment(this.selectedMonth).startOf('month').toDate();
    const endOfMonth = moment(this.selectedMonth).endOf('month').toDate();
    this.getDataByDate('months', startOfMonth, endOfMonth);
  }

  filterDataByMonthsRanges() {
    this.getDataByDate(
      'months',
      this.selectedStartMonth,
      this.selectedEndMonth
    );
  }

  filterDataByYear() {
    const startOfYear = moment(this.selectedYear).startOf('year').toDate();
    const endOfYear = moment(this.selectedYear).endOf('year').toDate();
    this.getDataByDate('months', startOfYear, endOfYear);
  }

  filterDataByYearsRanges() {
    this.getDataByDate('years', this.selectedStartYear, this.selectedEndYear);
  }

  filterDataByAdvancedDate() {
    this.getDataByDate(
      'days',
      this.selectedAdvancedDate[0],
      this.selectedAdvancedDate[1]
    );
  }

  getDataByDate(
    timeUnit: unitOfTime.DurationConstructor,
    startDate: Date,
    endDate: Date
  ) {
    const data: any[] = JSON.parse(JSON.stringify(this.data));
    const result: any[] = [];
    const dateStart = moment(startDate);
    const dateEnd = moment(endDate);

    data.forEach((item) => {
      let date = moment();
      if (item.startDate) {
        date = moment(item.startDate);
      } else if (item.createdAt) {
        date = moment(item.createdAt);
      }
      if (date.isBetween(dateStart, dateEnd, timeUnit, '[]')) {
        result.push(item);
      }
    });

    this.updateData.emit(result);
  }
}
