import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurrentIncidentsComponent } from './recurrent-incidents.component';

describe('RecurrentIncidentsComponent', () => {
  let component: RecurrentIncidentsComponent;
  let fixture: ComponentFixture<RecurrentIncidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecurrentIncidentsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RecurrentIncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a map', () => {
    const map = fixture.nativeElement.querySelector('.map');
    expect(map).toBeTruthy();
    expect(component.incidentMap).toBeTruthy();
  });
});
