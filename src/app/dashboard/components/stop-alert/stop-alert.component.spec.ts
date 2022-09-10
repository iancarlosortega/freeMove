import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StopAlertComponent } from './stop-alert.component';

describe('StopAlertComponent', () => {
  let component: StopAlertComponent;
  let fixture: ComponentFixture<StopAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StopAlertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StopAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
