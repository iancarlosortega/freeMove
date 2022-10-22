import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderRoutesComponent } from './slider-routes.component';

describe('SliderRoutesComponent', () => {
  let component: SliderRoutesComponent;
  let fixture: ComponentFixture<SliderRoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderRoutesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SliderRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
