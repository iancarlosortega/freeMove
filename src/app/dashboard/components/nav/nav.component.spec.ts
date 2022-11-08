import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { Notification, User } from 'src/app/interfaces';
import { MaterialModule } from 'src/app/material/material.module';
import {
  UserService,
  AuthService,
  NotificationService,
  RouteService,
} from 'src/app/services';

import { NavComponent } from './nav.component';

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

class AuthServiceStub {}

class NotificationServiceStub {
  getNotificationsByUser(idUser: string): Observable<Notification[]> {
    return of([]);
  }
}

class RouteServiceStub {
  getRoutes() {}
}

describe('NavComponent', () => {
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NavComponent],
      imports: [RouterTestingModule, MaterialModule],
      providers: [
        { provide: UserService, useClass: UserServiceStub },
        { provide: AuthService, useClass: AuthServiceStub },
        { provide: NotificationService, useClass: NotificationServiceStub },
        { provide: RouteService, useClass: RouteServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
