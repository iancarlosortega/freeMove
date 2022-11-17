import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeHoursComponent } from './range-hours.component';

describe('RangeHoursComponent', () => {
  let component: RangeHoursComponent;
  let fixture: ComponentFixture<RangeHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RangeHoursComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RangeHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate the different hour ranges from the routes', () => {
    component.routes = [
      {
        idRoute: '1',
        idUser: '1',
        startDate: new Date('2021-05-01T03:00:00'),
        endDate: new Date('2021-05-01T03:00:00'),
        distance: 0,
        name: 'Ruta 1',
        burnoutCalories: 0,
        coordinates: [],
        calification: 0,
        difficulty: 'Fácil',
        endPosition: [0, 0],
        keywords: [],
        photos: [],
        startPosition: [0, 0],
        timeElapsed: 0,
        type: 'Ciclista',
        velocityAvg: 0,
        activityType: 'Ciclista',
        city: 'Loja',
      },
    ];
    component.ngOnInit();
    expect(component.firstRange).toBe(1);
    expect(component.secondRange).toBe(0);
    expect(component.thirdRange).toBe(0);
    expect(component.fourthRange).toBe(0);

    component.routes = [
      {
        idRoute: '1',
        idUser: '1',
        startDate: new Date('2021-05-01T08:00:00'),
        endDate: new Date('2021-05-01T08:00:00'),
        distance: 0,
        name: 'Ruta 1',
        burnoutCalories: 0,
        coordinates: [],
        calification: 0,
        difficulty: 'Fácil',
        endPosition: [0, 0],
        keywords: [],
        photos: [],
        startPosition: [0, 0],
        timeElapsed: 0,
        type: 'Ciclista',
        velocityAvg: 0,
        activityType: 'Ciclista',
        city: 'Loja',
      },
    ];
    component.ngOnInit();
    expect(component.firstRange).toBe(1);
    expect(component.secondRange).toBe(1);
    expect(component.thirdRange).toBe(0);
    expect(component.fourthRange).toBe(0);

    component.routes = [
      {
        idRoute: '1',
        idUser: '1',
        startDate: new Date('2021-05-01T13:00:00'),
        endDate: new Date('2021-05-01T13:00:00'),
        distance: 0,
        name: 'Ruta 1',
        burnoutCalories: 0,
        coordinates: [],
        calification: 0,
        difficulty: 'Fácil',
        endPosition: [0, 0],
        keywords: [],
        photos: [],
        startPosition: [0, 0],
        timeElapsed: 0,
        type: 'Ciclista',
        velocityAvg: 0,
        activityType: 'Ciclista',
        city: 'Loja',
      },
    ];

    component.ngOnInit();
    expect(component.firstRange).toBe(1);
    expect(component.secondRange).toBe(1);
    expect(component.thirdRange).toBe(1);
    expect(component.fourthRange).toBe(0);

    component.routes = [
      {
        idRoute: '1',
        idUser: '1',
        startDate: new Date('2021-05-01T18:00:00'),
        endDate: new Date('2021-05-01T18:00:00'),
        distance: 0,
        name: 'Ruta 1',
        burnoutCalories: 0,
        coordinates: [],
        calification: 0,
        difficulty: 'Fácil',
        endPosition: [0, 0],
        keywords: [],
        photos: [],
        startPosition: [0, 0],
        timeElapsed: 0,
        type: 'Ciclista',
        velocityAvg: 0,
        activityType: 'Ciclista',
        city: 'Loja',
      },
    ];
    component.ngOnInit();
    expect(component.firstRange).toBe(1);
    expect(component.secondRange).toBe(1);
    expect(component.thirdRange).toBe(1);
    expect(component.fourthRange).toBe(1);
  });
});
