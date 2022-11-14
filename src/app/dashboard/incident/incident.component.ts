import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import firebase from '@firebase/app-compat';
import { Map, Marker } from 'mapbox-gl';
import { IncidentService } from 'src/app/services';
import { Incident } from 'src/app/interfaces';

@Component({
  selector: 'app-incident',
  templateUrl: './incident.component.html',
  styleUrls: ['./incident.component.css'],
})
export class IncidentComponent implements AfterViewInit {
  @ViewChild('mapDiv') mapElement!: ElementRef;
  @ViewChild('incidentMarker') incidentMarker!: ElementRef;
  incident: Incident = {
    idIncident: '',
    idRoute: '',
    title: '',
    description: '',
    category: 'Accidente',
    createdAt: firebase.firestore.Timestamp.now(),
    position: [0, 0],
    photos: [],
    isActive: false,
    city: '',
    keywords: [],
  };
  isLoading: boolean = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private incidentService: IncidentService
  ) {}

  ngAfterViewInit(): void {
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.incidentService.getIncidentById(id)))
      .subscribe((incident) => {
        if (!incident) {
          this.router.navigateByUrl('/dashboard/incidentes');
          return;
        }
        this.incident = incident;
        const map = new Map({
          container: this.mapElement.nativeElement,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: this.incident.position,
          zoom: 15,
        });
        new Marker(this.incidentMarker.nativeElement)
          .setLngLat(this.incident.position)
          .addTo(map);
        this.isLoading = false;
      });
  }
}
