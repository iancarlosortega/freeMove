import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { AlertService, NotificationService } from 'src/app/services';
import { Alert } from 'src/app/interfaces';

@Component({
  selector: 'app-link-account-invitation',
  templateUrl: './link-account-invitation.component.html',
  styleUrls: ['./link-account-invitation.component.css'],
})
export class LinkAccountInvitationComponent implements OnInit, OnDestroy {
  notificationObs!: Subscription;
  notification2Obs!: Subscription;
  alert: Alert = {
    idUser: '',
    idAlert: '',
    isActive: false,
    notificationStatus: 'rejected',
    emailToVinculate: '',
    emailFrom: '',
  };
  isAccepted: boolean = false;
  isLoading: boolean = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.notificationObs = this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.alertService.getAlertById(id)))
      .subscribe((alert) => {
        this.alert = alert as Alert;
        if (this.alert.notificationStatus === 'accepted') {
          this.isAccepted = true;
        }
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.notificationObs.unsubscribe();
    if (this.notification2Obs) {
      this.notification2Obs.unsubscribe();
    }
  }

  accept() {
    this.notification2Obs = this.notificationService
      .getNotificationByAlert(this.alert.idAlert)
      .subscribe((notification) => {
        this.alertService.acceptInvitation(
          this.alert,
          notification.idNotification!
        );
      });
  }

  reject() {
    this.notification2Obs = this.notificationService
      .getNotificationByAlert(this.alert.idAlert)
      .subscribe((notification) => {
        this.alertService.rejectInvitation(
          this.alert,
          notification.idNotification!
        );
      });
  }
}
