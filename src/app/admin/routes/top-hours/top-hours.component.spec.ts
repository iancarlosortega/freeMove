import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopHoursComponent } from './top-hours.component';

describe('TopHoursComponent', () => {
  let component: TopHoursComponent;
  let fixture: ComponentFixture<TopHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopHoursComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TopHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate the top hours from the routes', () => {
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
    expect(component.currentHours.length).toEqual(1);
    expect(component.currentHours[0].hour).toEqual('3');
    expect(component.currentHours[0].count).toEqual(1);
  });
});
