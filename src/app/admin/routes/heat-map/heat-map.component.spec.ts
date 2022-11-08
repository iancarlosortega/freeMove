import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatMapComponent } from './heat-map.component';
import { environment } from 'src/environments/environment';
import Mapboxgl from 'mapbox-gl';

Mapboxgl.accessToken = environment.mapboxToken;

describe('HeatMapComponent', () => {
  let component: HeatMapComponent;
  let fixture: ComponentFixture<HeatMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeatMapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeatMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
