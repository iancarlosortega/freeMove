import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Map } from 'mapbox-gl';
import moment from 'moment';
import { Route } from 'src/app/interfaces';
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
  isLoading: boolean = true;
  currentHours: any[] = [];
  firstRange: number = 0;
  secondRange: number = 0;
  thirdRange: number = 0;
  fourthRange: number = 0;

  constructor(
    private routeService: RouteService,
    private incidentService: IncidentService
  ) { }

  ngAfterViewInit(): void {
    this.routeService.getRoutes().subscribe((routes) => {
      this.routes = routes.map((route: Route) => mapRoute(route));
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
      // center: this.routes[0].startPosition,
      zoom: 12,
      bearing: 0,
    });

    this.routeMap.on('load', () => {
      // this.add3D();
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
    this.incidentService.getIncidents().subscribe((incidents) => {
      this.incidentMap = new Map({
        container: this.mapIncidents.nativeElement,
        style: 'mapbox://styles/mapbox/satellite-streets-v11',
        center: [-79.207599, -4.001713],
        // center: this.routes[0].startPosition,
        zoom: 12,
        bearing: 0,
      });

      this.incidentMap.on('load', () => {
        // this.add3D();
        incidents.forEach((incident, index) => {
          this.incidentMap.addSource('incident' + index, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: [incident.position],
              },
            },
          });

          this.incidentMap.addLayer(
            {
              id: 'incidentheat' + index,
              type: 'heatmap',
              source: 'incident' + index,
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

  add3D() {
    // add map 3d terrain and sky layer and fog
    // Add some fog in the background
    this.routeMap.setFog({
      range: [0.5, 10],
      color: 'white',
      'horizon-blend': 0.2,
    });

    // Add a sky layer over the horizon
    this.routeMap.addLayer({
      id: 'sky',
      type: 'sky',
      paint: {
        'sky-type': 'atmosphere',
        'sky-atmosphere-color': 'rgba(85, 151, 210, 0.5)',
      },
    });

    // Add terrain source, with slight exaggeration
    this.routeMap.addSource('mapbox-dem', {
      type: 'raster-dem',
      url: 'mapbox://mapbox.terrain-rgb',
      tileSize: 512,
      maxzoom: 14,
    });
    this.routeMap.setTerrain({ source: 'mapbox-dem', exaggeration: 1 });
  }
}
