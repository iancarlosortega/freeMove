import { Component } from '@angular/core';
import SwiperCore, { Autoplay } from 'swiper';
SwiperCore.use([Autoplay]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  sliderPhotos = [
    'assets/slider/slider-1.jpg',
    'assets/slider/slider-2.jpg',
    'assets/slider/slider-3.jpg',
    'assets/slider/slider-4.jpg',
  ];
}
