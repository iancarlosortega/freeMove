import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { Map, Marker } from 'mapbox-gl';
import { Incident } from 'src/app/interfaces';
import { IncidentService } from 'src/app/services';

@Component({
  selector: 'app-incident',
  templateUrl: './incident.component.html',
  styleUrls: ['./incident.component.css'],
})
export class IncidentComponent implements AfterViewInit {
  @ViewChild('mapDiv') mapElement!: ElementRef;
  incident: Incident = {
    idIncident: '',
    idRoute: '',
    title: '',
    description: '',
    type: '',
    createdAt: 0,
    position: [0, 0],
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private incidentService: IncidentService
  ) {}

  ngAfterViewInit(): void {
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.incidentService.getIncidentById(id)))
      .subscribe((incident) => {
        this.incident = incident;
        const map = new Map({
          container: this.mapElement.nativeElement,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: this.incident.position,
          zoom: 15,
        });
        new Marker().setLngLat(this.incident.position).addTo(map);
      });
  }
}
