import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/interfaces';
import { MaterialModule } from 'src/app/material/material.module';
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
      isActive: false,
      notificationStatus: 'accepted',
      emailToVinculate: 'iancarlosortegaleon@gmail.com',
      emailFrom: '',
    });
  }
}

class GeolocationServiceStub {
  getUserLocation() {
    return Promise.resolve([0, 0]);
  }
}

describe('TrackingComponent', () => {
  let component: TrackingComponent;
  let fixture: ComponentFixture<TrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrackingComponent],
      imports: [MaterialModule],
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

  it('should have an idUser', () => {
    expect(component.idUser).not.toBeNull();
  });

  it('should have a map', () => {
    const map = fixture.debugElement.query(By.css('.map'));
    expect(map).toBeTruthy();
  });

  it('should map not be visible if alert has no coordinates to show', () => {
    const map = fixture.debugElement.query(By.css('.map'));
    expect(map.classes['no-map']).toBeTruthy();
  });
});
