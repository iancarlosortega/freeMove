import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/interfaces';
import {
  UserService,
  AlertService,
  GeolocationService,
} from 'src/app/services';

import { TrackingComponent } from './tracking.component';

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

class AlertServiceStub {
  getAlertToUserVinculated(email: string) {
    return of({
      idUser: '1',
      idAlert: '1',
      isActive: true,
      notificationStatus: 'pending',
      emailToVinculate: 'iancarlosortegaleon@gmail.com',
      emailFrom: '',
    });
  }
}

class GeolocationServiceStub {}

describe('TrackingComponent', () => {
  let component: TrackingComponent;
  let fixture: ComponentFixture<TrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrackingComponent],
      providers: [
        { provide: UserService, useClass: UserServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: GeolocationService, useClass: GeolocationServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
