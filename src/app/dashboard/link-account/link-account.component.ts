import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import {
  NotificationService,
  SecurityService,
  UserService,
} from 'src/app/services';
import {
  LinkAccountNotification,
  SecurityAlert,
  User,
} from 'src/app/interfaces';

@Component({
  selector: 'app-link-account',
  templateUrl: './link-account.component.html',
  styleUrls: ['./link-account.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
      transition('* => void', [animate(300, style({ opacity: 0 }))]),
    ]),
  ],
})
export class LinkAccountComponent implements OnInit, OnDestroy {
  userObs!: Subscription;
  user!: User;
  alert!: SecurityAlert;
  notification!: LinkAccountNotification;
  isLoading: boolean = true;
  isErrorEmail: boolean = false;
  isErrorUser: boolean = false;

  linkAccountForm: FormGroup = this.fb.group({
    linkedEmail: ['', [Validators.required, Validators.email]],
  });

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private securityService: SecurityService,
    private notificationService: NotificationService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.userObs = this.userService.user$.subscribe((user) => {
      this.user = user;
      this.securityService
        .getAlertByUser(user.idUser)
        .subscribe(async (alert) => {
          if (!alert) {
            const alertRef = await this.securityService.createAlert(
              user.idUser
            );
            const data = await alertRef.get();
            this.alert = data.data() as SecurityAlert;
            return;
          }
          this.alert = alert;
          this.notificationService
            .getNotificationByAlert(alert.idAlert)
            .subscribe((notification) => {
              if (!notification) {
                this.isLoading = false;
                return;
              }
              this.notification = notification;
              switch (notification.status) {
                case 'accepted':
                  this.linkAccountForm
                    .get('linkedEmail')
                    ?.setValue(this.alert.linkedAccount);
                  break;
                case 'pending':
                  this.linkAccountForm
                    .get('linkedEmail')
                    ?.setValue(this.notification.emailToVinculate);
                  this.linkAccountForm.disable();
                  break;
                default:
                  break;
              }
              this.isLoading = false;
            });
        });
    });
  }

  ngOnDestroy(): void {
    this.userObs.unsubscribe();
  }

  invalidInput(campo: string) {
    return (
      this.linkAccountForm.get(campo)?.invalid &&
      this.linkAccountForm.get(campo)?.touched
    );
  }

  sendInvitation() {
    if (this.linkAccountForm.invalid) {
      this.linkAccountForm.markAllAsTouched();
      return;
    }

    const linkedEmail = this.linkAccountForm.get('linkedEmail')?.value;

    if (linkedEmail === this.user.email) {
      this.isErrorEmail = true;
      setTimeout(() => {
        this.isErrorEmail = false;
      }, 3500);
      return;
    }

    this.userService.getUserByEmail(linkedEmail).subscribe((user) => {
      if (!user) {
        this.isErrorUser = true;
        setTimeout(() => {
          this.isErrorUser = false;
        }, 3500);
        return;
      }

      const notification: LinkAccountNotification = {
        idUser: user.idUser,
        idUserFrom: this.user.idUser,
        idAlert: this.alert.idAlert,
        title: 'Vincular Cuenta',
        message: `${this.user.name} quiere vincular su cuenta con la tuya.`,
        status: 'pending',
        emailToVinculate: user.email,
        emailFrom: this.user.email,
        url: 'invitacion-vinculamiento',
      };

      this.notificationService.createNotification(notification).then(() => {
        this.toastrService.success(
          'Se ha enviado una notificación al usuario',
          'Notificación enviada'
        );
      });
    });
  }

  changeLinkedEmail() {
    console.log('changeLinkedEmail');
  }
}
