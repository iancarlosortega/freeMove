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
import {
  Gallery,
  GalleryItem,
  ImageItem,
  ImageSize,
  ThumbnailsPosition,
} from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';

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
  @ViewChild('popupMarker') popupMarker!: ElementRef;

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

        this.routeImages = this.route.photos.map(
          (photo) => new ImageItem({ src: photo, thumb: photo })
        );
        // Get a lightbox gallery ref
        const lightboxRef = this.gallery.ref('lightbox');

        // Add custom gallery config to the lightbox (optional)
        lightboxRef.setConfig({
          imageSize: ImageSize.Cover,
          thumbPosition: ThumbnailsPosition.Top,
        });

        // Load items into the lightbox gallery ref
        lightboxRef.load(this.routeImages);

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

          const htmlPopup = this.renderer.createElement('div');
          const htmlPopupTitle = this.renderer.createElement('h5');
          const htmlPopupDescription = this.renderer.createElement('p');
          htmlPopupTitle.innerHTML = incident.title;
          htmlPopupDescription.innerHTML = incident.description;
          this.renderer.appendChild(htmlPopup, htmlPopupTitle);
          this.renderer.appendChild(htmlPopup, htmlPopupDescription);
          const imagesContainer = this.renderer.createElement('div');
          this.renderer.addClass(imagesContainer, 'images-container');

          incident.photos.forEach((image, index) => {
            const imageElement = this.renderer.createElement('img');
            this.renderer.addClass(imageElement, 'image');
            this.renderer.setAttribute(imageElement, 'src', image);
            this.renderer.appendChild(imagesContainer, imageElement);
          });
          this.renderer.appendChild(htmlPopup, imagesContainer);
          const popup = new Popup({
            anchor: 'center',
          }).setHTML(htmlPopup.outerHTML);

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
