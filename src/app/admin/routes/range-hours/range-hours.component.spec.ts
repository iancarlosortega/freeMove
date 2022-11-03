import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeHoursComponent } from './range-hours.component';

describe('RangeHoursComponent', () => {
  let component: RangeHoursComponent;
  let fixture: ComponentFixture<RangeHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RangeHoursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RangeHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
