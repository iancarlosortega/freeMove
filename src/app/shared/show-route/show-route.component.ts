import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Map } from 'mapbox-gl';
import * as turf from '@turf/turf';
import { Popup, Marker } from 'mapbox-gl';
import { IncidentService } from 'src/app/services';
import { Incident, Route } from 'src/app/interfaces';
import {
  animatePath,
  flyInAndRotate,
  createGeoJSONCircle,
} from 'src/app/utils';

@Component({
  selector: 'app-show-route',
  templateUrl: './show-route.component.html',
  styleUrls: ['./show-route.component.css'],
})
export class ShowRouteComponent implements OnInit {
  @ViewChild('mapDiv') mapElement!: ElementRef;
  @ViewChild('startMarker') startMarker!: ElementRef;
  @ViewChild('endMarker') endMarker!: ElementRef;
  @Input() route!: Route;

  shareUrl: string = '';
  map!: Map;
  incidents: Incident[] = [];
  routeImages: string[] = [];

  constructor(
    @Inject(DOCUMENT) private document: any,
    private renderer: Renderer2,
    private incidentService: IncidentService
  ) {}

  ngOnInit(): void {
    this.incidentService
      .getIncidentsFromRoute(this.route!.idRoute)
      .subscribe(async (incidents) => {
        this.routeImages = this.route.photos?.map((photo) => photo.photoUrl);
        this.incidents = incidents;
        this.shareUrl = `${this.document.location.origin}/ruta/${this.route.idRoute}`;
        this.map = new Map({
          container: this.mapElement.nativeElement,
          projection: {
            name: 'globe',
          },
          style: 'mapbox://styles/mapbox/satellite-streets-v11',
          zoom: 1.9466794621990684,
          center: { lng: 12.563530000000014, lat: 58.27372323078674 },
          pitch: 70,
          bearing: 0,
        });

        this.generatePhotosInMap();
        this.generateIncidentsInMap();

        this.map.on('load', async () => {
          const trackGeojson = {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: this.route.coordinates,
            },
          };
          await this.playAnimations(trackGeojson, this.map);
        });
      });
  }

  async playAnimations(trackGeojson: any, map: Map) {
    return new Promise<void>(async (resolve) => {
      // add a geojson source and layer for the linestring to the map
      this.addPathSourceAndLayer(trackGeojson);
      // get the start of the linestring, to be used for animating a zoom-in from high altitude
      var targetLngLat = {
        lng: trackGeojson.geometry.coordinates[0][0],
        lat: trackGeojson.geometry.coordinates[0][1],
      };

      // animate zooming in to the start point, get the final bearing and altitude for use in the next animation
      const { bearing, altitude }: any = await flyInAndRotate({
        map,
        targetLngLat,
        duration: 5000,
        startAltitude: 3000000,
        endAltitude: 5000,
        startBearing: 0,
        endBearing: -20,
        startPitch: 30,
        endPitch: 40,
      });

      // follow the path while slowly rotating the camera, passing in the camera bearing and altitude from the previous animation
      await animatePath({
        map,
        duration: 10000,
        path: trackGeojson,
        startBearing: bearing,
        startAltitude: altitude,
        pitch: 40,
      });

      // get the bounds of the linestring, use fitBounds() to animate to a final view
      const bounds: any = turf.bbox(trackGeojson);
      map.fitBounds(bounds, {
        duration: 3000,
        pitch: 30,
        bearing: 0,
        padding: 120,
      });

      setTimeout(() => {
        resolve();
      }, 10000);
    });
  }

  addPathSourceAndLayer(trackGeojson: any) {
    // Add a line feature and layer. This feature will get updated as we progress the animation
    this.map.addSource('line', {
      type: 'geojson',
      // Line metrics is required to use the 'line-progress' property
      lineMetrics: true,
      data: trackGeojson,
    });
    this.map.addLayer({
      id: 'line-layer',
      type: 'line',
      source: 'line',
      paint: {
        'line-color': 'rgba(0,0,0,0)',
        'line-width': 9,
        'line-opacity': 0.8,
      },
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
    });

    this.map.addSource('start-pin-base', {
      type: 'geojson',
      data: createGeoJSONCircle(
        trackGeojson.geometry.coordinates[0],
        0.04
      ) as any,
    });

    this.map.addSource('end-pin-base', {
      type: 'geojson',
      data: createGeoJSONCircle(
        trackGeojson.geometry.coordinates.slice(-1)[0],
        0.04
      ) as any,
    });

    this.map.addLayer({
      id: 'start-fill-pin-base',
      type: 'fill-extrusion',
      source: 'start-pin-base',
      paint: {
        'fill-extrusion-color': '#0bfc03',
        'fill-extrusion-height': 100,
      },
    });

    this.map.addLayer({
      id: 'end-fill-pin-base',
      type: 'fill-extrusion',
      source: 'end-pin-base',
      paint: {
        'fill-extrusion-color': '#eb1c1c',
        'fill-extrusion-height': 100,
      },
    });
  }

  generatePhotosInMap() {
    this.route.photos?.forEach((photo) => {
      const popup = new Popup({ offset: 25 }).setHTML(
        `<img src="${photo.photoUrl}" width="200px" height="200px" />`
      );
      const element = this.renderer.createElement('div');
      this.renderer.addClass(element, 'photo-marker');
      this.renderer.setStyle(
        element,
        'background-image',
        `url(${photo.photoUrl})`
      );
      new Marker(element)
        .setLngLat([photo.longitude, photo.latitude])
        .setPopup(popup)
        .addTo(this.map);
    });
  }

  generateIncidentsInMap() {
    this.incidents.forEach((incident) => {
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
        .addTo(this.map);
    });
  }
}
