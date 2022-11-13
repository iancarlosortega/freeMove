import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { Route, User } from 'src/app/interfaces';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';
import { RouteService, UserService } from 'src/app/services';
import firebase from '@firebase/app-compat';

import { RoutesComponent } from './routes.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class RouteServiceStub {
  getRoutesByUser(idUser: string): Observable<Route[]> {
    return of([
      {
        idRoute: '1',
        idUser: '1',
        name: 'Route 1',
        distance: 100,
        calification: 5,
        difficulty: 'Fácil',
        photos: [],
        keywords: [],
        type: 'Ciclista',
        city: 'Bogotá',
        startPosition: '4.7110,-74.0721',
        startDate: firebase.firestore.Timestamp.now(),
        endPosition: '4.7110,-74.0721',
        endDate: firebase.firestore.Timestamp.now(),
        coordinates: ['1,1', '1,1'] as any,
        burnoutCalories: 100,
        timeElapsed: 100,
        velocityAvg: 100,
        activityType: 'Ciclista',
      },
    ]);
  }

  deleteRoute(id: string) {}

  deleteAllRoutes(idUser: string) {}

  deleteRoutesByUser(idUser: string) {}
}

class MatDialogStub {
  open() {}
}

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
      imports: [MaterialModule, PrimeNgModule, BrowserAnimationsModule],
      providers: [
        { provide: RouteService, useClass: RouteServiceStub },
        // { provide: MatDialog, useClass: MatDialogStub },
        {
          provide: MatDialogRef,
          useFactory: () =>
            jasmine.createSpyObj('MatDialogRef', ['close', 'afterClosed']),
        },
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

  it('should have an idUser', () => {
    expect(component.idUser).not.toBeNull();
  });

  it('should delete button call deleteRoute method', () => {
    const spy = spyOn(component, 'deleteRoute');
    const button = fixture.nativeElement.querySelector('.route-button');
    button.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should show confirm dialog when delete button is clicked', () => {
    const spy = spyOn(component.dialog, 'open');
    const button = fixture.nativeElement.querySelector('.route-button');
    button.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should delete the route if the user confirms', () => {
    const routeService = TestBed.inject(RouteService);

    spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () => of(true),
    } as MatDialogRef<typeof component>);

    spyOn(routeService, 'deleteRoute').and.callThrough();
    component.deleteRoute('1');
    expect(component.dialog).toBeDefined();
    expect(routeService.deleteRoute).toHaveBeenCalled();
  });

  it('should not delete the route if the user cancels', () => {
    const routeService = TestBed.inject(RouteService);

    spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () => of(false),
    } as MatDialogRef<typeof component>);

    spyOn(routeService, 'deleteRoute').and.callThrough();
    component.deleteRoute('1');
    expect(component.dialog).toBeDefined();
    expect(routeService.deleteRoute).not.toHaveBeenCalled();
  });

  it('should delete all routes button call deleteAllRoutes method', () => {
    const spy = spyOn(component, 'deleteAllRoutes');
    const button = fixture.nativeElement.querySelector('header button');
    button.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should show confirm dialog when delete all routes button is clicked', () => {
    const spy = spyOn(component.dialog, 'open');
    const button = fixture.nativeElement.querySelector('header button');
    button.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should delete all routes if the user confirms', () => {
    const routeService = TestBed.inject(RouteService);

    spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () => of(true),
    } as MatDialogRef<typeof component>);

    spyOn(routeService, 'deleteRoutesByUser').and.callThrough();
    component.deleteAllRoutes();
    expect(component.dialog).toBeDefined();
    expect(routeService.deleteRoutesByUser).toHaveBeenCalled();
  });

  it('should not delete all routes if the user cancels', () => {
    const routeService = TestBed.inject(RouteService);

    spyOn(component.dialog, 'open').and.returnValue({
      afterClosed: () => of(false),
    } as MatDialogRef<typeof component>);

    spyOn(routeService, 'deleteRoutesByUser').and.callThrough();
    component.deleteAllRoutes();
    expect(component.dialog).toBeDefined();
    expect(routeService.deleteRoutesByUser).not.toHaveBeenCalled();
  });

  it('should have a list of routes', () => {
    expect(component.routes).not.toBeNull();
  });

  it('should remove the accent from the route name', () => {
    const routeName = 'Ruta con ácéntó';
    expect(component.removeAccents(routeName)).toBe('Ruta con acento');
  });
});
