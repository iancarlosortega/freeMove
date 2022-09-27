import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlinkAccountComponent } from './unlink-account.component';

describe('UnlinkAccountComponent', () => {
  let component: UnlinkAccountComponent;
  let fixture: ComponentFixture<UnlinkAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnlinkAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnlinkAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
