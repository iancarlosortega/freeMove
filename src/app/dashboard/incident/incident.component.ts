import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Map, Marker } from 'mapbox-gl';
import { Incident } from 'src/app/interfaces';
import { IncidentService } from 'src/app/services';
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
  selector: 'app-incident',
  templateUrl: './incident.component.html',
  styleUrls: ['./incident.component.css'],
})
export class IncidentComponent implements AfterViewInit {
  @ViewChild('mapDiv') mapElement!: ElementRef;
  @ViewChild('incidentMarker') incidentMarker!: ElementRef;
  incident: Incident = {
    idIncident: '',
    idRoute: '',
    title: '',
    description: '',
    type: '',
    createdAt: 0,
    position: [0, 0],
    photos: [],
    isActive: false,
  };
  incidentImages: GalleryItem[] = [];

  constructor(
    public gallery: Gallery,
    public lightbox: Lightbox,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private incidentService: IncidentService
  ) {}

  ngAfterViewInit(): void {
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.incidentService.getIncidentById(id)))
      .subscribe((incident) => {
        if (!incident) {
          this.router.navigateByUrl('/dashboard/incidentes');
          return;
        }
        this.incident = incident;
        const map = new Map({
          container: this.mapElement.nativeElement,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: this.incident.position,
          zoom: 15,
        });
        new Marker(this.incidentMarker.nativeElement)
          .setLngLat(this.incident.position)
          .addTo(map);
        this.incidentImages = this.incident.photos.map(
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
        lightboxRef.load(this.incidentImages);
      });
  }
}
