import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  Renderer2,
  AfterViewInit,
} from '@angular/core';
import { Map, Popup, Marker } from 'mapbox-gl';
import { Incident } from 'src/app/interfaces';

@Component({
  selector: 'app-recurrent-incidents',
  templateUrl: './recurrent-incidents.component.html',
  styleUrls: ['./recurrent-incidents.component.css'],
})
export class RecurrentIncidentsComponent implements AfterViewInit {
  @ViewChild('mapIncidents') mapIncidents!: ElementRef;
  @Input() incidents: Incident[] = [];
  @Input() totalIncidents: Incident[] = [];
  incidentMap!: Map;
  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.incidentMap = new Map({
      container: this.mapIncidents.nativeElement,
      style: 'mapbox://styles/mapbox/satellite-streets-v11',
      center: [-79.207599, -4.001713],
      zoom: 12,
      bearing: 0,
    });

    this.incidentMap.on('load', () => {
      this.loadMarkers(this.incidents);
    });
  }

  updateData(newIncidents: any) {
    const markers = document.querySelectorAll('.incident-marker');
    markers.forEach((marker) => {
      marker.remove();
    });
    this.loadMarkers(newIncidents);
    this.incidents = newIncidents;
  }

  loadMarkers(incidents: Incident[]) {
    incidents.forEach((incident) => {
      const popup = new Popup({ offset: 25 }).setHTML(
        `<h5>${incident.title}</h5>
        <p>${incident.description}</p>
        <a class="primary-button" href="/dashboard/incidentes/${incident.idIncident}">Ver Más</a>`
      );

      const element = this.renderer.createElement('div');
      this.renderer.addClass(element, 'marker');
      this.renderer.addClass(element, 'incident-marker');

      new Marker(element)
        .setLngLat(incident.position)
        .setPopup(popup)
        .addTo(this.incidentMap);
    });
  }
}
