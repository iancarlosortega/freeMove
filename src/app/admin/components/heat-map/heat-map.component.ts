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
  selector: 'app-heat-map',
  templateUrl: './heat-map.component.html',
  styleUrls: ['./heat-map.component.css'],
})
export class HeatMapComponent implements AfterViewInit {
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
        this.routeMap.addSource('route' + index, {
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

        this.routeMap.addLayer(
          {
            id: 'routeheat' + index,
            type: 'heatmap',
            source: 'route' + index,
            maxzoom: 24,
            paint: {
              // increase weight as diameter breast height increases
              'heatmap-weight': {
                property: 'dbh',
                type: 'exponential',
                stops: [
                  [1, 0],
                  [62, 1],
                ],
              },
              // increase intensity as zoom level increases
              'heatmap-intensity': {
                stops: [
                  [11, 1],
                  [15, 3],
                ],
              },
              // assign color values be applied to points depending on their density
              'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0,
                'rgba(236,222,239,0)',
                0.2,
                'rgb(208,209,230)',
                0.4,
                'rgb(166,189,219)',
                0.6,
                'rgb(103,169,207)',
                0.8,
                'rgb(28,144,153)',
              ],
              // increase radius as zoom increases
              'heatmap-radius': {
                stops: [
                  [11, 15],
                  [15, 20],
                ],
              },
              // decrease opacity to transition into the circle layer
              'heatmap-opacity': {
                default: 1,
                stops: [
                  [14, 1],
                  [15, 0],
                ],
              },
            },
          },
          'waterway-label'
        );
      });
      this.routeMap.resize();
    });
  }
}
