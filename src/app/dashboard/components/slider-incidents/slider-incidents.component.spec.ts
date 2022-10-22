import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderIncidentsComponent } from './slider-incidents.component';

describe('SliderIncidentsComponent', () => {
  let component: SliderIncidentsComponent;
  let fixture: ComponentFixture<SliderIncidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderIncidentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SliderIncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
