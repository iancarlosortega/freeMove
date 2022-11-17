import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Route } from 'src/app/interfaces';

import { ChartsComponent } from './charts.component';

describe('ChartsComponent', () => {
  let component: ChartsComponent;
  let fixture: ComponentFixture<ChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the labels of days and month from the data passed', () => {
    const data = [
      {
        idRoute: '1',
        idUser: '1',
        name: 'Route 1',
        distance: 100,
        calification: 5,
        difficulty: 'Fácil',
        startDate: new Date('2021-01-01'),
        endDate: new Date('2021-01-01'),
      } as Route,
    ];

    const labels = component.getLabelsFromData(data);
    expect(labels).toEqual(['31/12']);
  });

  it('should return the string in titleCase', () => {
    const string = 'hola mundo';
    const stringTitleCase = component.toTitleCase(string);
    expect(stringTitleCase).toEqual('Hola Mundo');
  });

  it('should have two charts', () => {
    const charts = fixture.nativeElement.querySelectorAll('.chart');
    expect(charts.length).toEqual(2);
  });
});
