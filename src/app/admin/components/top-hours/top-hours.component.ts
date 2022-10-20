import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';
import { Route } from 'src/app/interfaces';

@Component({
  selector: 'app-top-hours',
  templateUrl: './top-hours.component.html',
  styleUrls: ['./top-hours.component.css'],
})
export class TopHoursComponent implements OnInit {
  @Input() routes: Route[] = [];
  currentHours: any[] = [];
  constructor() {}

  ngOnInit(): void {
    const result: any[] = [];
    this.routes.forEach((route) => {
      result.push(moment(route.startDate).hour());
    });
    // Create object from duplicate elements in array
    const counts = result.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});
    // Create array from object
    const resultArray = Object.keys(counts).map((key) => ({
      hour: key,
      count: counts[key],
    }));
    // Sort array by count
    resultArray.sort((a, b) => b.count - a.count);
    // Get the first 3 elements
    this.currentHours = resultArray.slice(0, 5);
  }
}
