import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { AuthService, UserService, AlertService } from 'src/app/services';
import { Alert, User } from 'src/app/interfaces';

import { SideMenuComponent } from './side-menu.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class AuthServiceStub {}
class UserServiceStub {
  get user$(): Observable<User> {
    return of({
      idUser: '1',
      email: 'iancarlosortegaleon@gmail.com',
      name: 'Ian Carlos',
      age: 20,
      phone: '+380501234567',
      role: 'CLIENT-ROLE',
      provider: 'email-password',
    });
  }
}
class AlertServiceStub {
  getAlertByUser(): Observable<Alert> {
    return of({
      idAlert: '1',
      idUser: '1',
      isActive: true,
      notificationStatus: 'pending',
      emailToVinculate: '',
      emailFrom: '',
    });
  }
}

describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SideMenuComponent],
      providers: [
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: UserService, useClass: UserServiceStub },
        { provide: AlertService, useClass: AlertServiceStub },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a user', () => {
    expect(component.user).toBeTruthy();
  });

  it('should have an alert', () => {
    expect(component.alert).toBeTruthy();
  });
});
