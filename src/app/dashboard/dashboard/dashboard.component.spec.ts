import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { User, Incident, Route } from 'src/app/interfaces';
import { UserService, RouteService, IncidentService } from 'src/app/services';

import { DashboardComponent } from './dashboard.component';

class UserServiceStub {
  get user$(): Observable<User> {
    return of({
      idUser: '1',
      email: 'iancarlosortegaleon@gmail.com',
      name: 'Ian Carlos',
      age: 20,
      phone: '+380501234567',
      role: 'ADMIN-ROLE',
      provider: 'email-password',
    });
  }
}

class RouteServiceStub {
  getRoutesByUser(idUser: string): Observable<Route[]> {
    return of([]);
  }
}

class IncidentServiceStub {
  getIncidents(): Observable<Incident[]> {
    return of([]);
  }
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      providers: [
        { provide: UserService, useClass: UserServiceStub },
        { provide: RouteService, useClass: RouteServiceStub },
        { provide: IncidentService, useClass: IncidentServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
