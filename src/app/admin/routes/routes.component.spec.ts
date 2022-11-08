import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { Route } from 'src/app/interfaces';
import { RouteService, IncidentService } from 'src/app/services';

import { RoutesComponent } from './routes.component';

class RouteServiceStub {
  getRoutes(): Observable<Route[]> {
    return of([]);
  }
}

class IncidentServiceStub {
  getIncidents() {}
}

describe('RoutesComponent', () => {
  let component: RoutesComponent;
  let fixture: ComponentFixture<RoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoutesComponent],
      providers: [
        { provide: RouteService, useClass: RouteServiceStub },
        { provide: IncidentService, useClass: IncidentServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
