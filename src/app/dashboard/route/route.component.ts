import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Map } from 'mapbox-gl';
import { RouteService } from 'src/app/services';
import { Route } from 'src/app/interfaces';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css'],
})
export class RouteComponent implements OnInit, AfterViewInit {
  @ViewChild('mapDiv') mapElement!: ElementRef;

  //TODO: Probar en producción
  shareUrl: string = location.href;
  route: Route = {
    idRoute: '',
    idUser: '',
    name: '',
    distance: 0,
    type: '',
    city: '',
    startPoint: [0, 0],
    endPoint: [0, 0],
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private routeService: RouteService
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
      .pipe(switchMap(({ id }) => this.routeService.getRouteById(id)))
      .subscribe((route) => {
        this.route = route;

        //TODO: ELiminar todo este bloque de código cuando se tenga la data real
        this.route.startDate = new Date(
          this.route.startDate
        ).toLocaleString() as any;
        this.route.endDate = new Date(
          this.route.endDate
        ).toLocaleString() as any;
        console.log(this.route);
        // Cambiar el tipo de coordinates de acuerdo a la respuesta de la base de datos
        this.route.coordinates = this.route.coordinates.map((route: any) =>
          route.split(',').map((coord: any) => parseFloat(coord))
        ) as any;

        const map = new Map({
          container: this.mapElement.nativeElement,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: this.route.startPoint,
          zoom: 15,
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
              'line-color': '#1d273b',
              'line-width': 6,
            },
          });
        });
      });
  }
}
