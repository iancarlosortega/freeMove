import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Map, Marker, Popup } from 'mapbox-gl';
import { IncidentService, RouteService } from 'src/app/services';
import { Incident, Route } from 'src/app/interfaces';
import { switchMap, tap } from 'rxjs';
import {
  Gallery,
  GalleryItem,
  ImageItem,
  ImageSize,
  ThumbnailsPosition,
} from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import * as turf from '@turf/turf';
import {
  animatePath,
  flyInAndRotate,
  createGeoJSONCircle,
} from 'src/app/utils';

import SwiperCore, { Pagination } from 'swiper';
SwiperCore.use([Pagination]);

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
  map!: Map;
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
    calification: 0,
    difficulty: 'Fácil',
    photos: [],
    keywords: [],
  };
  incidents: Incident[] = [];
  routeImages: GalleryItem[] = [];
  incidentImages: GalleryItem[] = [];

  constructor(
    public gallery: Gallery,
    public lightbox: Lightbox,
    private renderer: Renderer2,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private routeService: RouteService,
    private incidentService: IncidentService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => this.routeService.getRouteById(id)),
        tap((route) => {
          if (!route) {
            this.router.navigateByUrl('/dashboard/rutas');
            return;
          }
          this.route = route;
        }),
        switchMap((route) =>
          this.incidentService.getIncidentsFromRoute(route!.idRoute)
        )
      )
      .subscribe(async (incidents) => {
        this.incidents = incidents;

        //TODO: ELiminar todo este bloque de código cuando se tenga la data real
        // Cambiar el tipo de coordinates de acuerdo a la respuesta de la base de datos
        this.route.coordinates = this.route.coordinates.map((route: any) =>
          route.split(',').map((coord: any) => parseFloat(coord))
        ) as any;

        this.map = new Map({
          container: this.mapElement.nativeElement,
          projection: {
            name: 'globe',
          },
          // style: 'mapbox://styles/mapbox/satellite-v9',
          style: 'mapbox://styles/mapbox/satellite-streets-v11',
          zoom: 1.9466794621990684,
          center: { lng: 12.563530000000014, lat: 58.27372323078674 },
          pitch: 70,
          bearing: 0,
        });

        this.generateGalleryOfPhotos();
        this.generatePhotosInMap();
        this.generateIncidentsInMap();

        this.map.on('load', async () => {
          this.add3D();
          // fetch the geojson for the linestring to be animated

          // const trackGeojson = {
          //   type: 'Feature',
          //   properties: {},
          //   geometry: {
          //     type: 'LineString',
          //     // coordinates: this.route.coordinates,
          //     coordinates: [
          //       [-79.208501, -3.995997],
          //       [-79.208284, -3.996099],
          //       [-79.208157, -3.996608],
          //       [-79.20808, -3.99727],
          //       [-79.208029, -3.997753],
          //       [-79.208012, -3.99781],
          //       [-79.207949, -3.998529],
          //       [-79.207917, -3.998956],
          //       [-79.20789, -3.999375],
          //       [-79.207897, -3.999947],
          //       [-79.207871, -4.000537],
          //       [-79.20781, -4.00104],
          //       [-79.19724, -4.039425],
          //     [-79.197393, -4.044753],
          //     [-79.207178, -3.979853],
          //     [5.4953, 47.06675],
          //     [5.49403, 47.06163],
          //     ],
          //   },
          // };

          const trackGeojson = await fetch(
            `assets/data/female-stage-1.geojson`
          ).then((d) => d.json());

          // kick off the animations
          await this.playAnimations(trackGeojson, this.map);
        });
      });
  }

  add3D() {
    // add map 3d terrain and sky layer and fog
    // Add some fog in the background
    this.map.setFog({
      range: [0.5, 10],
      color: 'white',
      'horizon-blend': 0.2,
    });

    // Add a sky layer over the horizon
    this.map.addLayer({
      id: 'sky',
      type: 'sky',
      paint: {
        'sky-type': 'atmosphere',
        'sky-atmosphere-color': 'rgba(85, 151, 210, 0.5)',
      },
    });

    // Add terrain source, with slight exaggeration
    this.map.addSource('mapbox-dem', {
      type: 'raster-dem',
      url: 'mapbox://mapbox.terrain-rgb',
      tileSize: 512,
      maxzoom: 14,
    });
    this.map.setTerrain({ source: 'mapbox-dem', exaggeration: 1 });
  }

  async playAnimations(trackGeojson: any, map: Map) {
    return new Promise<void>(async (resolve) => {
      // add a geojson source and layer for the linestring to the map
      this.addPathSourceAndLayer(trackGeojson);
      const prod = false;
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
        endAltitude: 15000,
        startBearing: 0,
        endBearing: -20,
        startPitch: 40,
        endPitch: 50,
      });

      // follow the path while slowly rotating the camera, passing in the camera bearing and altitude from the previous animation
      await animatePath({
        map,
        duration: 30000,
        path: trackGeojson,
        startBearing: bearing,
        startAltitude: altitude,
        pitch: 50,
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

    this.map.addSource('start-pin-top', {
      type: 'geojson',
      data: createGeoJSONCircle(
        trackGeojson.geometry.coordinates[0],
        0.25
      ) as any,
    });

    this.map.addSource('end-pin-base', {
      type: 'geojson',
      data: createGeoJSONCircle(
        trackGeojson.geometry.coordinates.slice(-1)[0],
        0.04
      ) as any,
    });

    this.map.addSource('end-pin-top', {
      type: 'geojson',
      data: createGeoJSONCircle(
        trackGeojson.geometry.coordinates.slice(-1)[0],
        0.25
      ) as any,
    });

    this.map.addLayer({
      id: 'start-fill-pin-base',
      type: 'fill-extrusion',
      source: 'start-pin-base',
      paint: {
        'fill-extrusion-color': '#0bfc03',
        'fill-extrusion-height': 1000,
      },
    });
    this.map.addLayer({
      id: 'start-fill-pin-top',
      type: 'fill-extrusion',
      source: 'start-pin-top',
      paint: {
        'fill-extrusion-color': '#0bfc03',
        'fill-extrusion-base': 1000,
        'fill-extrusion-height': 1200,
      },
    });

    this.map.addLayer({
      id: 'end-fill-pin-base',
      type: 'fill-extrusion',
      source: 'end-pin-base',
      paint: {
        'fill-extrusion-color': '#eb1c1c',
        'fill-extrusion-height': 1000,
      },
    });
    this.map.addLayer({
      id: 'end-fill-pin-top',
      type: 'fill-extrusion',
      source: 'end-pin-top',
      paint: {
        'fill-extrusion-color': '#eb1c1c',
        'fill-extrusion-base': 1000,
        'fill-extrusion-height': 1200,
      },
    });
  }

  generateGalleryOfPhotos() {
    this.routeImages = this.route.photos.map(
      (photo) => new ImageItem({ src: photo.photoUrl, thumb: photo.photoUrl })
    );
    const lightboxRef = this.gallery.ref('lightbox');
    lightboxRef.setConfig({
      imageSize: ImageSize.Cover,
      thumbPosition: ThumbnailsPosition.Top,
    });
    lightboxRef.load(this.routeImages);
  }

  generatePhotosInMap() {
    this.route.photos.forEach((photo) => {
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
        .setLngLat([photo.latitude, photo.longitude])
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
