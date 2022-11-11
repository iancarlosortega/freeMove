import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Alert } from 'src/app/interfaces';
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
      emailFrom: 'test@gmail.com',
    });
  }

  acceptInvitation(alert: Alert, idNotification: string) {}

  rejectInvitation(alert: Alert, idNotification: string) {}
}

class NotificationServiceStub {
  getNotificationByAlert(idAlert: string) {
    return of({
      idNotification: '1',
      idAlert: '1',
      idUser: '1',
      email: '',
      notificationType: 'link-account',
      notificationStatus: 'pending',
    });
  }
}

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

  it('should have two buttons', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');
    expect(buttons.length).toBe(2);
  });

  it('should have a button with text "Aceptar"', () => {
    const acceptButton = fixture.nativeElement.querySelector('.confirm-button');
    expect(acceptButton.textContent).toContain('Aceptar');
  });

  it('should have a button with text "Rechazar"', () => {
    const rejectButton = fixture.nativeElement.querySelector('.cancel-button');
    expect(rejectButton.textContent).toContain('Rechazar');
  });

  it('should accept button call accept method', () => {
    const acceptButton = fixture.nativeElement.querySelector('.confirm-button');
    spyOn(component, 'accept');
    acceptButton.click();
    expect(component.accept).toHaveBeenCalled();
  });

  it('should cancel button call reject method', () => {
    const rejectButton = fixture.nativeElement.querySelector('.cancel-button');
    spyOn(component, 'reject');
    rejectButton.click();
    expect(component.reject).toHaveBeenCalled();
  });

  it('should link account invitation description contain the emailFrom', () => {
    const description = fixture.nativeElement.querySelector('.custom-card > p');
    expect(description.textContent).toContain('test@gmail.com');
  });

  it('should accept method call acceptInvitation from AlertService', () => {
    const alertService = TestBed.inject(AlertService);
    spyOn(alertService, 'acceptInvitation');
    component.accept();
    expect(alertService.acceptInvitation).toHaveBeenCalled();
  });

  it('should reject method call rejectInvitation from AlertService', () => {
    const alertService = TestBed.inject(AlertService);
    spyOn(alertService, 'rejectInvitation');
    component.reject();
    expect(alertService.rejectInvitation).toHaveBeenCalled();
  });
});
