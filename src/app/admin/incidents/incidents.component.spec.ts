import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { IncidentService } from 'src/app/services';
import { Incident } from 'src/app/interfaces';

import { IncidentsComponent } from './incidents.component';

class IncidentServiceStub {
  getIncidents(): Observable<Incident[]> {
    return of([]);
  }
}
class ToastrServiceStub {}

describe('IncidentsComponent', () => {
  let component: IncidentsComponent;
  let fixture: ComponentFixture<IncidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IncidentsComponent],
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
      imports: [RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create nashe', () => {
    expect(component).toBeTruthy();
  });
});
