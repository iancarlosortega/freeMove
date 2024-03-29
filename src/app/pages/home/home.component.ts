import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { IncidentService, RouteService, UserService } from 'src/app/services';
import { Incident, Route, User } from 'src/app/interfaces';

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
    'assets/slider/slider-1',
    'assets/slider/slider-2',
    'assets/slider/slider-3',
    'assets/slider/slider-4',
  ];
  users: User[] = [];
  routes: Route[] = [];
  incidents: Incident[] = [];
  isLoading: boolean = false;
  isCountReady: boolean = false;

  constructor(
    private userService: UserService,
    private routeService: RouteService,
    private incidentService: IncidentService
  ) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
      this.routeService.getRoutes().subscribe((routes) => {
        this.routes = routes;
        this.incidentService.getIncidents().subscribe((incidents) => {
          this.incidents = incidents;
          this.isCountReady = true;
        });
      });
    });
  }

  changeLoadingState() {
    this.isLoading = true;
  }
}
