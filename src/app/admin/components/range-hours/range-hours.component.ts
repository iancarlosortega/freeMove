import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';
import { Route } from 'src/app/interfaces';

@Component({
  selector: 'app-range-hours',
  templateUrl: './range-hours.component.html',
  styleUrls: ['./range-hours.component.css'],
})
export class RangeHoursComponent implements OnInit {
  @Input() routes: Route[] = [];
  firstRange: number = 0;
  secondRange: number = 0;
  thirdRange: number = 0;
  fourthRange: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.routes.forEach((route) => {
      const hour = moment(route.startDate).hour();
      if (hour >= 3 && hour < 8) {
        this.firstRange++;
      } else if (hour >= 8 && hour < 13) {
        this.secondRange++;
      } else if (hour >= 13 && hour < 18) {
        this.thirdRange++;
      } else if (hour >= 18 && hour < 22) {
        this.fourthRange++;
      }
    });
  }
}
