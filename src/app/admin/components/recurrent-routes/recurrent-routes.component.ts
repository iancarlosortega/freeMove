import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { Map } from 'mapbox-gl';
import { Route } from 'src/app/interfaces';

@Component({
  selector: 'app-recurrent-routes',
  templateUrl: './recurrent-routes.component.html',
  styleUrls: ['./recurrent-routes.component.css'],
})
export class RecurrentRoutesComponent implements AfterViewInit {
  @ViewChild('mapRoutes') mapRoutes!: ElementRef;
  @Input() routes: Route[] = [];
  routeMap!: Map;
  constructor() {}

  ngAfterViewInit(): void {
    this.routeMap = new Map({
      container: this.mapRoutes.nativeElement,
      style: 'mapbox://styles/mapbox/satellite-streets-v11',
      center: [-79.207599, -4.001713],
      zoom: 12,
      bearing: 0,
    });
    this.routeMap.on('load', () => {
      this.routes.forEach((route, index) => {
        this.routeMap.addSource('recurrent-route' + index, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: route.coordinates,
            },
          },
        });
        this.routeMap.addLayer({
          id: 'recurrent-route' + index,
          type: 'line',
          source: 'recurrent-route' + index,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#c58b16',
            'line-width': 8,
          },
        });
      });
    });
  }
}
