import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { Observable } from 'rxjs';

import { FiltersComponent } from './filters.component';

class PrimeNGConfigStub {
  setTranslation(res: any) {}
}

class TranslateServiceStub {
  use(lang: string) {}

  get(key: string): Observable<any> {
    return new Observable();
  }
}

describe('FiltersComponent', () => {
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FiltersComponent],
      providers: [
        { provide: PrimeNGConfig, useClass: PrimeNGConfigStub },
        { provide: TranslateService, useClass: TranslateServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
