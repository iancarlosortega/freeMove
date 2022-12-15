import { Component, OnDestroy, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, take } from 'rxjs';
import { AlertService, UserService } from 'src/app/services';
import { Alert, User } from 'src/app/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { UnlinkAccountComponent } from '../components/unlink-account/unlink-account.component';

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
  securityObs!: Subscription;
  alertObs!: Subscription;
  user!: User;
  alert!: Alert;
  isLoading: boolean = true;
  isErrorEmail: boolean = false;
  isErrorUser: boolean = false;

  linkAccountForm: FormGroup = this.fb.group({
    linkedEmail: ['', [Validators.required, Validators.email]],
  });

  constructor(
    public dialog: MatDialog,
    private fb: FormBuilder,
    private userService: UserService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.userObs = this.userService.user$.subscribe((user) => {
      this.user = user;
      this.securityObs = this.alertService
        .getAlertByUser(user.idUser)
        .subscribe((alert) => {
          if (alert) {
            this.alert = alert;
            this.isLoading = false;
            switch (alert?.notificationStatus) {
              case 'accepted':
                this.linkAccountForm
                  .get('linkedEmail')
                  ?.setValue(this.alert.linkedAccount);
                this.linkAccountForm.enable();
                break;
              case 'pending':
                this.linkAccountForm
                  .get('linkedEmail')
                  ?.setValue(this.alert.emailToVinculate);
                this.linkAccountForm.disable();
                break;
              default:
                this.linkAccountForm.reset();
                this.linkAccountForm.enable();
                break;
            }
          } else {
            this.alertService.createAlert(user.idUser);
          }
        });
    });
  }

  ngOnDestroy(): void {
    this.userObs.unsubscribe();
    this.securityObs.unsubscribe();
    if (this.alertObs) {
      this.alertObs.unsubscribe();
    }
  }

  invalidInput(field: string) {
    return (
      this.linkAccountForm.get(field)?.invalid &&
      this.linkAccountForm.get(field)?.touched
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
    this.alertObs = this.alertService
      .createInvitation(linkedEmail, this.user, this.alert)
      .pipe(take(1))
      .subscribe((error) => {
        console.log(error);
        if (error) {
          this.isErrorUser = true;
          setTimeout(() => {
            this.isErrorUser = false;
          }, 3500);
        }
      });
  }

  changeLinkedEmail() {
    if (this.linkAccountForm.invalid) {
      this.linkAccountForm.markAllAsTouched();
      return;
    }
    const linkedEmail = this.linkAccountForm.get('linkedEmail')?.value;
    if (this.alert.linkedAccount === linkedEmail) {
      console.log('No se ha cambiado el email');
      return;
    }

    const dialog = this.dialog.open(UnlinkAccountComponent, {
      width: '400px',
    });

    dialog.afterClosed().subscribe(async (result: boolean) => {
      if (result) {
        this.alertObs = this.alertService
          .createInvitation(linkedEmail, this.user, this.alert)
          .subscribe((error) => {
            if (error) {
              this.isErrorUser = true;
              setTimeout(() => {
                this.isErrorUser = false;
              }, 3500);
            }
          });
      }
    });
  }
}
