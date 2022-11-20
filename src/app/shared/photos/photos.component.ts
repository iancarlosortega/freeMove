import { Component, Input, OnInit } from '@angular/core';
import { Gallery, ImageItem, ImageSize, ThumbnailsPosition } from 'ng-gallery';
import { Lightbox } from 'ng-gallery/lightbox';
import SwiperCore, { Pagination } from 'swiper';
SwiperCore.use([Pagination]);

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css'],
})
export class PhotosComponent implements OnInit {
  @Input() photos: string[] = [];

  constructor(public gallery: Gallery, public lightbox: Lightbox) {}

  ngOnInit(): void {
    const galleryImages = this.photos?.map(
      (photo) => new ImageItem({ src: photo, thumb: photo })
    );
    const lightboxRef = this.gallery.ref('lightbox');
    lightboxRef.setConfig({
      imageSize: ImageSize.Cover,
      thumbPosition: ThumbnailsPosition.Top,
    });
    lightboxRef.load(galleryImages);
  }
}
