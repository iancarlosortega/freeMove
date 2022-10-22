import { Component, Input, OnInit } from '@angular/core';
import { Route } from 'src/app/interfaces';

@Component({
  selector: 'app-slider-routes',
  templateUrl: './slider-routes.component.html',
  styleUrls: ['./slider-routes.component.css'],
})
export class SliderRoutesComponent implements OnInit {
  @Input() routes: Route[] = [];
  sliderRoutes: any[] = [];

  constructor() {}

  ngOnInit(): void {
    this.routes.forEach((route) => {
      route.photos?.forEach((photo) => {
        this.sliderRoutes.push({
          idRoute: route.idRoute,
          name: route.name,
          photo: photo.photoUrl,
        });
      });
    });
  }
}
