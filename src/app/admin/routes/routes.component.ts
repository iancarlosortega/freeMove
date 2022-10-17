import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Map, Marker, Popup } from 'mapbox-gl';
import moment from 'moment';
import { switchMap, tap } from 'rxjs';
import { Incident, Route } from 'src/app/interfaces';
import { IncidentService, RouteService } from 'src/app/services';
import { mapRoute } from 'src/app/utils';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css'],
})
export class RoutesComponent implements AfterViewInit {
  @ViewChild('mapRoutes') mapRoutes!: ElementRef;
  @ViewChild('mapIncidents') mapIncidents!: ElementRef;
  routeMap!: Map;
  incidentMap!: Map;
  routes: Route[] = [];
  incidents: Incident[] = [];
  isLoading: boolean = true;
  currentHours: any[] = [];
  firstRange: number = 0;
  secondRange: number = 0;
  thirdRange: number = 0;
  fourthRange: number = 0;

  constructor(
    private renderer: Renderer2,
    private routeService: RouteService,
    private incidentService: IncidentService
  ) {}

  ngAfterViewInit(): void {
    this.routeService
      .getRoutes()
      .pipe(
        tap((routes) => (this.routes = routes.map((route) => mapRoute(route)))),
        switchMap(() => this.incidentService.getIncidents())
      )
      .subscribe((incidents) => {
        this.incidents = incidents;
        this.isLoading = false;
        this.getRangeCounters();
        this.getCurrentHours();
        this.getRecurrentRoutes();
        this.getRecurrentIncidents();
      });
  }

  getRecurrentRoutes() {
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
    });
  }

  getRecurrentIncidents() {
    this.incidentMap = new Map({
      container: this.mapIncidents.nativeElement,
      style: 'mapbox://styles/mapbox/satellite-streets-v11',
      center: [-79.207599, -4.001713],
      zoom: 12,
      bearing: 0,
    });

    this.incidentMap.on('load', () => {
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
          .addTo(this.incidentMap);
      });
    });
  }

  getRangeCounters() {
    const routes: Route[] = JSON.parse(JSON.stringify(this.routes));
    routes.forEach((route) => {
      const hour = moment(route.startDate).hour();
      if (hour >= 3 && hour < 8) {
        this.firstRange++;
      } else if (hour >= 8 && hour < 13) {
        this.secondRange++;
      } else if (hour >= 13 && hour < 18) {
        this.thirdRange++;
      } else if (hour >= 18 && hour < 22) {
        this.fourthRange++;
      }
    });
  }

  getCurrentHours() {
    const result: any[] = [];
    const routes: Route[] = JSON.parse(JSON.stringify(this.routes));
    routes.forEach((route) => {
      result.push(moment(route.startDate).hour());
    });
    // Create object from duplicate elements in array
    const counts = result.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});
    // Create array from object
    const resultArray = Object.keys(counts).map((key) => ({
      hour: key,
      count: counts[key],
    }));
    // Sort array by count
    resultArray.sort((a, b) => b.count - a.count);
    // Get the first 3 elements
    this.currentHours = resultArray.slice(0, 5);
  }
}
