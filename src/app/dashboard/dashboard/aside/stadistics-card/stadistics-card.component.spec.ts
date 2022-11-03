import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StadisticsCardComponent } from './stadistics-card.component';

describe('StadisticsCardComponent', () => {
  let component: StadisticsCardComponent;
  let fixture: ComponentFixture<StadisticsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StadisticsCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StadisticsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
