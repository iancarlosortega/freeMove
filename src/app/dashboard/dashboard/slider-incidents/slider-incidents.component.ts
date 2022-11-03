import { Component, Input, OnInit } from '@angular/core';
import moment from 'moment';
import { Incident } from 'src/app/interfaces';

@Component({
  selector: 'app-slider-incidents',
  templateUrl: './slider-incidents.component.html',
  styleUrls: ['../slider-routes/slider-routes.component.css'],
})
export class SliderIncidentsComponent implements OnInit {
  @Input() incidents: Incident[] = [];
  sliderIncidents: Incident[] = [];

  constructor() {}

  ngOnInit(): void {
    this.sliderIncidents = this.incidents.filter((incident) =>
      moment(incident.createdAt.toDate()).isSameOrAfter(
        moment().subtract(7, 'days'),
        'days'
      )
    );
  }
}
