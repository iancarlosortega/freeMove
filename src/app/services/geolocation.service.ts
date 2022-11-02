import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private reactiveDeviceLocation$: Subject<Object>;

  constructor() {
    this.reactiveDeviceLocation$ = new BehaviorSubject<Object>({});
  }

  getUserLocation(): Promise<[number, number]> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        alert('Su navegador no soporta la geolocalización');
        reject('Su navegador no soporta la geolocalización');
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve([position.coords.longitude, position.coords.latitude]);
        },
        (error) => {
          alert('No se pudo obtener la ubicación');
          console.log(error);
          reject(error);
        }
      );
    });
  }

  getLocation(): Observable<Object> {
    const opts = {
      enableHighAccuracy: true,
      maximumAge: 60000,
      timeout: 30000,
    };
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        console.log(currentLocation);
        this.reactiveDeviceLocation$.next(currentLocation);
      },
      (err) => {
        console.log(err);
      },
      opts
    );
    console.log(watchId);
    return this.reactiveDeviceLocation$;
  }
}
