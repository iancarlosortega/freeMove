import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopHoursComponent } from './top-hours.component';

describe('TopHoursComponent', () => {
  let component: TopHoursComponent;
  let fixture: ComponentFixture<TopHoursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TopHoursComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
