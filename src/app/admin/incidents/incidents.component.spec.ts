import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { IncidentService } from 'src/app/services';
import { Incident } from 'src/app/interfaces';
import firebase from '@firebase/app-compat';
import { By } from '@angular/platform-browser';
import { MaterialModule } from 'src/app/material/material.module';
import { PrimeNgModule } from 'src/app/prime-ng/prime-ng.module';

import { IncidentsComponent } from './incidents.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class IncidentServiceStub {
  getIncidents(): Observable<Incident[]> {
    return of([
      {
        idIncident: '1',
        idRoute: '1',
        title: 'Incidente 1',
        description: 'Incidente 1',
        city: 'Bogotá',
        isActive: true,
        category: 'Accidente',
        createdAt: firebase.firestore.Timestamp.now(),
        position: [1, 1],
        keywords: ['Incidente 1'],
        photos: [''],
      },
    ]);
  }

  toggleIncidentStatus(id: string, status: boolean): Promise<void> {
    return Promise.resolve();
  }
}
class ToastrServiceStub {}

describe('IncidentsComponent', () => {
  let component: IncidentsComponent;
  let fixture: ComponentFixture<IncidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncidentsComponent],
      imports: [MaterialModule, PrimeNgModule],
      providers: [
        {
          provide: IncidentService,
          useClass: IncidentServiceStub,
        },
        {
          provide: ToastrService,
          useClass: ToastrServiceStub,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mat-slide-toggle on change toggle the incident status', () => {
    const incidentService = TestBed.inject(IncidentService);
    const spy = spyOn(
      incidentService,
      'toggleIncidentStatus'
    ).and.callThrough();

    const checkboxElem = fixture.debugElement.query(By.css('mat-slide-toggle'));
    checkboxElem.triggerEventHandler('change', {});

    expect(spy).toHaveBeenCalled();
  });

  it('should get the icon from each category', () => {
    const accidentIcon = component.getIncidentIcon('Accidente');
    const robberyIcon = component.getIncidentIcon('Robo');
    const badRouteicon = component.getIncidentIcon('Ciclovía en mal estado');
    const blockedRouteIcon = component.getIncidentIcon('Ciclovía obstruida');

    expect(accidentIcon).toEqual('/assets/icons/accident.png');
    expect(robberyIcon).toEqual('/assets/icons/robbery.png');
    expect(badRouteicon).toEqual('/assets/icons/road-bad-state.png');
    expect(blockedRouteIcon).toEqual('/assets/icons/road-blocked.png');
  });
});
