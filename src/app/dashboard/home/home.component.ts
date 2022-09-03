import { Component, OnInit } from '@angular/core';
import SwiperCore, { Autoplay } from 'swiper';
SwiperCore.use([Autoplay]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  //TODO: Eliminar estas imágenes
  photos = [
    {
      src: 'assets/test/1.jpg',
      alt: '',
    },
    {
      src: 'assets/test/2.jpg',
      alt: '',
    },
    {
      src: 'assets/test/3.jpg',
      alt: '',
    },
    {
      src: 'assets/test/4.webp',
      alt: '',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
