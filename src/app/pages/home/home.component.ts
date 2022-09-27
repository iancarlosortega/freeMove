import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import {
  Router,
  GuardsCheckStart,
  GuardsCheckEnd,
  NavigationCancel,
} from '@angular/router';
import SwiperCore, { Autoplay } from 'swiper';
SwiperCore.use([Autoplay]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
      transition('* => void', [animate(300, style({ opacity: 0 }))]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  sliderPhotos = [
    'assets/slider/slider-1.jpg',
    'assets/slider/slider-2.jpg',
    'assets/slider/slider-3.jpg',
    'assets/slider/slider-4.jpg',
  ];
  isLoading: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof GuardsCheckStart) {
        this.isLoading = true;
      }
      if (
        event instanceof GuardsCheckEnd ||
        event instanceof NavigationCancel
      ) {
        this.isLoading = false;
      }
    });
  }

  changeLoadingState() {
    this.isLoading = true;
  }
}
