import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { City, CountryApi } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  baseUrl: string = environment.paisesURL;

  constructor(private http: HttpClient) {}

  getCountries() {
    return this.http.get<CountryApi>(`${this.baseUrl}/countries/iso`);
  }

  getCitiesByCountry(country: string) {
    return this.http.post<City>(`${this.baseUrl}/countries/cities`, {
      country,
    });
  }
}
