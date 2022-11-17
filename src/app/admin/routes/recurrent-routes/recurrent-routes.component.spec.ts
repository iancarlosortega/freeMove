import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurrentRoutesComponent } from './recurrent-routes.component';

describe('RecurrentRoutesComponent', () => {
  let component: RecurrentRoutesComponent;
  let fixture: ComponentFixture<RecurrentRoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecurrentRoutesComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RecurrentRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a map', () => {
    const map = fixture.nativeElement.querySelector('.map');
    expect(map).toBeTruthy();
    expect(component.routeMap).toBeTruthy();
  });
});
