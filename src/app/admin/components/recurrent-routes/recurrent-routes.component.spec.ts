import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurrentRoutesComponent } from './recurrent-routes.component';

describe('RecurrentRoutesComponent', () => {
  let component: RecurrentRoutesComponent;
  let fixture: ComponentFixture<RecurrentRoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecurrentRoutesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecurrentRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
