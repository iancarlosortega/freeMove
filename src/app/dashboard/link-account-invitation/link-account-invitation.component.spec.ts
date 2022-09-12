import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkAccountInvitationComponent } from './link-account-invitation.component';

describe('LinkAccountInvitationComponent', () => {
  let component: LinkAccountInvitationComponent;
  let fixture: ComponentFixture<LinkAccountInvitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkAccountInvitationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkAccountInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
