import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurrentIncidentsComponent } from './recurrent-incidents.component';

describe('RecurrentIncidentsComponent', () => {
  let component: RecurrentIncidentsComponent;
  let fixture: ComponentFixture<RecurrentIncidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecurrentIncidentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecurrentIncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
