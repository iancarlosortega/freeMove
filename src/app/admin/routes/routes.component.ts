import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Map } from 'mapbox-gl';
import { environment } from 'src/environments/environment';
// const MapboxDirections = require('@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions');

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css'],
})
export class RoutesComponent implements AfterViewInit {
  @ViewChild('mapDiv') mapElement!: ElementRef;
  map!: Map;

  constructor() {}
  ngAfterViewInit(): void {
    // const map = new Map({
    //   container: this.mapElement.nativeElement,
    //   style: 'mapbox://styles/mapbox/streets-v11',
    //   center: [-79.2433982, -4.0075088],
    //   zoom: 13,
    // });
    // this.map.addControl(
    //   new MapboxDirections({
    //     accessToken: environment.mapboxToken,
    //     unit: 'metric',
    //     profile: 'mapbox/cycling',
    //   }),
    //   'top-left'
    // );
    // map.on('load', function () {
    //   var url =
    //     'https://s3.us-east-1.amazonaws.com/hdx-production-filestore/resources/6fa37b41-ad28-40a6-9641-3b4efd4dbe13/ecuador.geojson?AWSAccessKeyId=AKIAXYC32WNARK756OUG&Signature=CxrCpR%2BCwvBxWgP%2FX1rUSQ%2FFXWs%3D&Expires=1662251187';
    //   map.addSource('source_id', { type: 'geojson', data: url });
    // });
    // const map = new Map({
    //   container: this.mapElement.nativeElement,
    //   // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    //   style: 'mapbox://styles/mapbox/streets-v11',
    //   center: [-122.486052, 37.830348],
    //   zoom: 15,
    // });
    // map.on('load', () => {
    //   map.addSource('route', {
    //     type: 'geojson',
    //     data: {
    //       type: 'Feature',
    //       properties: {},
    //       geometry: {
    //         type: 'LineString',
    //         coordinates: [
    //           [-122.483696, 37.833818],
    //           [-122.483482, 37.833174],
    //           [-122.483396, 37.8327],
    //           [-122.483568, 37.832056],
    //           [-122.48404, 37.831141],
    //           [-122.48404, 37.830497],
    //           [-122.483482, 37.82992],
    //           [-122.483568, 37.829548],
    //           [-122.48507, 37.829446],
    //           [-122.4861, 37.828802],
    //           [-122.486958, 37.82931],
    //           [-122.487001, 37.830802],
    //           [-122.487516, 37.831683],
    //           [-122.488031, 37.832158],
    //           [-122.488889, 37.832971],
    //           [-122.489876, 37.832632],
    //           [-122.490434, 37.832937],
    //           [-122.49125, 37.832429],
    //           [-122.491636, 37.832564],
    //           [-122.492237, 37.833378],
    //           [-122.493782, 37.833683],
    //         ],
    //       },
    //     },
    //   });
    //   map.addLayer({
    //     id: 'route',
    //     type: 'line',
    //     source: 'route',
    //     layout: {
    //       'line-join': 'round',
    //       'line-cap': 'round',
    //     },
    //     paint: {
    //       'line-color': '#888',
    //       'line-width': 8,
    //     },
    //   });
    // });
  }

  ngOnInit(): void {}

  saveRoute() {
    console.log(this.map);
    console.log('save route');
  }
}
