import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Route } from 'src/app/interfaces';

import { StadisticsComponent } from './stadistics.component';

describe('StadisticsComponent', () => {
  let component: StadisticsComponent;
  let fixture: ComponentFixture<StadisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StadisticsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(StadisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the labels of days from the data passed', () => {
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

    const labels = component.getLabelsFromData(data, 'D');
    expect(labels).toEqual(['31']);
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

    const labels = component.getLabelsFromData(data, 'DD/MM');
    expect(labels).toEqual(['31/12']);
  });

  it('should return the labels of month from the data passed', () => {
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

    const labels = component.getLabelsFromData(data, 'MMMM');
    expect(labels).toEqual(['Diciembre']);
  });

  it('should return the labels of years from the data passed', () => {
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

    const labels = component.getLabelsFromData(data, 'YYYY');
    expect(labels).toEqual(['2020']);
  });

  it('should return the string in titleCase', () => {
    const string = 'hola mundo';
    const stringTitleCase = component.toTitleCase(string);
    expect(stringTitleCase).toEqual('Hola Mundo');
  });
});
