import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AlertService, NotificationService } from 'src/app/services';

import { LinkAccountInvitationComponent } from './link-account-invitation.component';

class ActivatedRouteStub {
  params: Observable<any> = of({});
}

class AlertServiceStub {
  getAlertById(id: string) {
    return of({
      idUser: '1',
      idAlert: '1',
      isActive: true,
      notificationStatus: 'pending',
      emailToVinculate: 'iancarlosortegaleon@gmail.com',
      emailFrom: '',
    });
  }
}

class NotificationServiceStub {}

describe('LinkAccountInvitationComponent', () => {
  let component: LinkAccountInvitationComponent;
  let fixture: ComponentFixture<LinkAccountInvitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LinkAccountInvitationComponent],
      providers: [
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: AlertService, useClass: AlertServiceStub },
        { provide: NotificationService, useClass: NotificationServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LinkAccountInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
