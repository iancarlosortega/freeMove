import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Subscription, switchMap, tap } from 'rxjs';
import { Map, Marker } from 'mapbox-gl';
import { Alert } from 'src/app/interfaces';
import {
  AlertService,
  GeolocationService,
  UserService,
} from 'src/app/services';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css'],
})
export class TrackingComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapDiv') mapElement!: ElementRef;

  userObs!: Subscription;
  alert: Alert = {
    idAlert: '',
    idUser: '',
    isActive: false,
    notificationStatus: 'rejected',
    emailToVinculate: '',
    emailFrom: '',
  };
  idUser: string = '';
  isLoading: boolean = true;
  hasBeenVinculated: boolean = false;
  isPending: boolean = false;

  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private geoLocationService: GeolocationService
  ) {}

  ngAfterViewInit(): void {
    this.userObs = this.userService.user$
      .pipe(
        tap((user) => (this.idUser = user.idUser)),
        switchMap((user) =>
          this.alertService.getAlertToUserVinculated(user.email)
        )
      )
      .subscribe(async (alert) => {
        if (!alert) {
          this.isLoading = false;
          return;
        }
        this.alert = alert;
        this.isPending = alert.notificationStatus === 'pending';
        this.hasBeenVinculated = alert.notificationStatus === 'accepted';
        if (alert.startPosition && alert.endPosition) {
          const map = new Map({
            container: this.mapElement.nativeElement,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: this.alert.endPosition || this.alert.startPosition,
            zoom: 15,
          });
          new Marker()
            .setLngLat(this.alert.endPosition || this.alert.startPosition!)
            .addTo(map);
        } else {
          const map = new Map({
            container: this.mapElement.nativeElement,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: await this.geoLocationService.getUserLocation(),
            zoom: 15,
          });
          new Marker()
            .setLngLat(await this.geoLocationService.getUserLocation())
            .addTo(map);
        }
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.userObs.unsubscribe();
  }

  activateAlert() {
    this.alertService.activateAlert(this.idUser);
  }

  desactivateAlert() {
    this.alertService.desactivateAlert(this.alert);
  }
}
