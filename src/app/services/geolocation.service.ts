import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  constructor() {}

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
}
