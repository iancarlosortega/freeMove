import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Map, Marker, Popup } from 'mapbox-gl';
import { IncidentService, RouteService } from 'src/app/services';
import { Incident, Route } from 'src/app/interfaces';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css'],
})
export class RouteComponent implements OnInit, AfterViewInit {
  @ViewChild('mapDiv') mapElement!: ElementRef;
  @ViewChild('startMarker') startMarker!: ElementRef;
  @ViewChild('endMarker') endMarker!: ElementRef;

  //TODO: Probar en producción
  shareUrl: string = location.href;
  route: Route = {
    idRoute: '',
    idUser: '',
    name: '',
    distance: 0,
    type: '',
    city: '',
    startPosition: [0, 0],
    endPosition: [0, 0],
    coordinates: [],
    startDate: new Date(),
    endDate: new Date(),
    burnoutCalories: 0,
    timeElapsed: 0,
    timeInMoving: 0,
    velocityAvg: 0,
    velocityMax: 0,
    activityType: '',
  };
  incidents: Incident[] = [];

  constructor(
    private renderer: Renderer2,
    private activatedRoute: ActivatedRoute,
    private routeService: RouteService,
    private incidentService: IncidentService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // this.map.addControl(
    //   new MapboxDirections({
    //     accessToken: environment.mapboxToken,
    //     unit: 'metric',
    //     profile: 'mapbox/cycling',
    //   }),
    //   'top-left'
    // );

    //TODO: Hacer un resolver
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.routeService.getRouteById(id)),
        tap((route) => (this.route = route)),
        switchMap((route) =>
          this.incidentService.getIncidentsFromRoute(route.idRoute)
        )
      )
      .subscribe((incidents) => {
        this.incidents = incidents;

        //TODO: ELiminar todo este bloque de código cuando se tenga la data real
        this.route.startDate = new Date(
          this.route.startDate
        ).toLocaleString() as any;
        this.route.endDate = new Date(
          this.route.endDate
        ).toLocaleString() as any;
        // Cambiar el tipo de coordinates de acuerdo a la respuesta de la base de datos
        this.route.coordinates = this.route.coordinates.map((route: any) =>
          route.split(',').map((coord: any) => parseFloat(coord))
        ) as any;

        const map = new Map({
          container: this.mapElement.nativeElement,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: this.route.startPosition,
          zoom: 15,
        });
        new Marker(this.startMarker.nativeElement)
          .setLngLat(this.route.startPosition)
          .addTo(map);
        new Marker(this.endMarker.nativeElement)
          .setLngLat(this.route.endPosition)
          .addTo(map);

        incidents.forEach((incident) => {
          const element = this.renderer.createElement('div');
          this.renderer.addClass(element, 'marker');
          this.renderer.addClass(element, 'incident-marker');

          const popup = new Popup({ offset: 25 }).setHTML(
            '<h5>' + incident.title + '</h5><p>' + incident.description + '</p>'
          );

          new Marker(element)
            .setLngLat(incident.position)
            .setPopup(popup)
            .addTo(map);
        });

        map.on('load', () => {
          map.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: this.route.coordinates as any,
              },
            },
          });
          map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#843e3e',
              'line-width': 6,
            },
          });
        });
      });
  }
}
