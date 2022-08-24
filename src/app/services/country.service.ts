import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { City, CountryApi } from '../interfaces';
import { catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  baseUrl: string = environment.paisesURL;

  constructor(private http: HttpClient) {}

  getCountries() {
    return this.http.get<CountryApi>(`${this.baseUrl}/countries/iso`).pipe(
      map(({ data }) => data.map((country) => country.name)),
      catchError((error) => {
        console.log(error);
        return [];
      })
    );
  }

  getCitiesByCountry(country: string) {
    return this.http
      .post<City>(`${this.baseUrl}/countries/cities`, {
        country,
      })
      .pipe(
        map((cities) => cities.data),
        catchError((error) => {
          console.log(error);
          return [];
        })
      );
  }
}
