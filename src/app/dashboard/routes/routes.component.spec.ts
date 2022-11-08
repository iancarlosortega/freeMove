import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/interfaces';
import { RouteService, UserService } from 'src/app/services';

import { RoutesComponent } from './routes.component';

class RouteServiceStub {
  getRoutesByUser(idUser: string): Observable<Route[]> {
    return of([]);
  }
}

class MatDialogStub {}

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

describe('RoutesComponent', () => {
  let component: RoutesComponent;
  let fixture: ComponentFixture<RoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoutesComponent],
      providers: [
        { provide: RouteService, useClass: RouteServiceStub },
        { provide: MatDialog, useClass: MatDialogStub },
        { provide: UserService, useClass: UserServiceStub },
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
