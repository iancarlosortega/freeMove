import { Component, OnInit } from '@angular/core';
import { IncidentService } from 'src/app/services';
import { Incident } from 'src/app/interfaces';

@Component({
  selector: 'app-slider-incidents',
  templateUrl: './slider-incidents.component.html',
  styleUrls: ['../slider-routes/slider-routes.component.css'],
})
export class SliderIncidentsComponent implements OnInit {
  incidents: Incident[] = [];

  constructor(private incidentService: IncidentService) {}

  ngOnInit(): void {
    this.incidentService.getRecentIncidents().subscribe((incidents) => {
      this.incidents = incidents;
    });
  }
}
