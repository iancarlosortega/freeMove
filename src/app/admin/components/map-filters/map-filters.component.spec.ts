import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { Observable } from 'rxjs';

import { MapFiltersComponent } from './map-filters.component';

class PrimeNGConfigStub {
  setTranslation(res: any) {}
}

class TranslateServiceStub {
  use(lang: string) {}

  get(key: string): Observable<any> {
    return new Observable();
  }
}

describe('MapFiltersComponent', () => {
  let component: MapFiltersComponent;
  let fixture: ComponentFixture<MapFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MapFiltersComponent],
      providers: [
        { provide: PrimeNGConfig, useClass: PrimeNGConfigStub },
        { provide: TranslateService, useClass: TranslateServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MapFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update the data to the father component with the data filtered by date', () => {
    const spy = spyOn(component.updateData, 'emit');
    component.getDataByDate('M', new Date(), new Date());
    expect(spy).toHaveBeenCalled();
  });
});
