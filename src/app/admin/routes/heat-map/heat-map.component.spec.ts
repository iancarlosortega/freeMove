import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatMapComponent } from './heat-map.component';
import { environment } from 'src/environments/environment';
import { By } from '@angular/platform-browser';
import Mapboxgl from 'mapbox-gl';
import { NO_ERRORS_SCHEMA } from '@angular/core';

Mapboxgl.accessToken = environment.mapboxToken;

describe('HeatMapComponent', () => {
  let component: HeatMapComponent;
  let fixture: ComponentFixture<HeatMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeatMapComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HeatMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a map', () => {
    const map = fixture.debugElement.query(By.css('.map'));
    expect(map).toBeTruthy();
  });
});
