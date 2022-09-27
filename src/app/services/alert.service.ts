import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmAlertComponent } from 'src/app/dashboard/components/confirm-alert/confirm-alert.component';
import { StopAlertComponent } from 'src/app/dashboard/components/stop-alert/stop-alert.component';
import { UserService, NotificationService, GeolocationService } from './';
import { Alert, Notification, User } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(
    public dialog: MatDialog,
    private toastr: ToastrService,
    private firestore: AngularFirestore,
    private router: Router,
    private userService: UserService,
    private notificationService: NotificationService,
    private geolocationService: GeolocationService
  ) {}

  activateAlert(idUser: string) {
    const dialog = this.dialog.open(ConfirmAlertComponent, {
      width: '400px',
    });

    dialog.afterClosed().subscribe((result: boolean) => {
      if (!result) return;

      this.getAlertByUserNoRealtime(idUser).subscribe(async (alert) => {
        if (!alert) {
          this.createAlert(idUser);
          this.toastr.warning(
            'No se ha vinculado una cuenta de correo electrónico',
            'Vincular Cuenta'
          );
          this.router.navigateByUrl('/dashboard/vincular-cuenta');
          return;
        }

        if (!alert.linkedAccount) {
          this.toastr.warning(
            'No se ha vinculado una cuenta de correo electrónico',
            'Vincular Cuenta'
          );
          this.router.navigateByUrl('/dashboard/vincular-cuenta');
          return;
        }

        this.firestore
          .collection('alerts')
          .doc(alert.idAlert)
          .update({
            isActive: true,
            startTime: Date.now(),
            startPosition: await this.geolocationService.getUserLocation(),
            endTime: '',
            endPosition: '',
            //TODO: Cambiar las coords
            coordinates: await this.geolocationService.getUserLocation(),
          });
      });
    });
  }

  desactivateAlert(alert: Alert) {
    const dialog = this.dialog.open(StopAlertComponent, {
      width: '400px',
    });

    dialog.afterClosed().subscribe(async (result: boolean) => {
      if (result) {
        this.firestore
          .collection('alerts')
          .doc(alert.idAlert)
          .update({
            isActive: false,
            endTime: Date.now(),
            endPosition: await this.geolocationService.getUserLocation(),
          });
      }
    });
  }

  createAlert(idUser: string) {
    return this.firestore.collection('alerts').add({
      idUser,
      isActive: false,
    });
  }

  createInvitation(linkedEmail: string, userFrom: User, alert: Alert) {
    return this.userService.getUserByEmail(linkedEmail).pipe(
      map((user) => {
        if (!user) {
          return true;
        }

        this.firestore.collection('alerts').doc(alert.idAlert).update({
          notificationStatus: 'pending',
          emailToVinculate: linkedEmail,
          emailFrom: userFrom.email,
          linkedAccount: '',
          startTime: '',
          endTime: '',
          startPosition: '',
          endPosition: '',
          coordinates: '',
        });

        const notification: Notification = {
          idAlert: alert.idAlert,
          idUser: user.idUser,
          title: 'Vincular Cuenta',
          message: `${userFrom.name} quiere vincular su cuenta con la tuya.`,
          url: 'invitacion-vinculamiento',
        };

        this.notificationService.createNotification(notification).then(() => {
          this.toastr.success('Invitación enviada correctamente');
        });

        return false;
      })
    );
  }

  acceptInvitation(alert: Alert, idNotification: string) {
    this.firestore
      .collection('alerts')
      .doc(alert.idAlert)
      .update({
        linkedAccount: alert.emailToVinculate,
        notificationStatus: 'accepted',
      })
      .then((res) => {
        this.router.navigate(['/dashboard'], { replaceUrl: true });
        this.toastr.success(
          'Cuenta vinculada correctamente',
          'Vincular Cuenta'
        );
        this.firestore.collection('notifications').doc(idNotification).delete();
      });
  }

  rejectInvitation(alert: Alert, idNotification: string) {
    this.firestore
      .collection('alerts')
      .doc(alert.idAlert)
      .update({
        emailFrom: '',
        emailToVinculate: '',
        notificationStatus: 'rejected',
      })
      .then((res) => {
        this.router.navigate(['/dashboard'], { replaceUrl: true });
        this.firestore.collection('notifications').doc(idNotification).delete();
      });
  }

  getAlertById(id: string) {
    return this.firestore
      .collection('alerts')
      .doc(id)
      .snapshotChanges()
      .pipe(
        map((a) => {
          const data = a.payload.data() as Alert;
          data.idAlert = a.payload.id;
          return data;
        })
      );
  }

  getAlertByUser(idUser: string) {
    return this.firestore
      .collection('alerts', (ref) => ref.where('idUser', '==', idUser))
      .snapshotChanges()
      .pipe(
        map((result) => {
          return result.map((a) => {
            const data = a.payload.doc.data() as Alert;
            data.idAlert = a.payload.doc.id;
            return data;
          });
        }),
        map((result) => result[0])
      );
  }

  getAlertByUserNoRealtime(idUser: string) {
    return this.firestore
      .collection('alerts', (ref) => ref.where('idUser', '==', idUser))
      .get()
      .pipe(
        map((result) => {
          if (result.docs.length === 0) return null;
          const alert = result.docs[0].data() as Alert;
          alert.idAlert = result.docs[0].id;
          return alert;
        })
      );
  }

  getAlertToUserVinculated(email: string) {
    return this.firestore
      .collection('alerts', (ref) => ref.where('emailToVinculate', '==', email))
      .snapshotChanges()
      .pipe(
        map((result) => {
          return result.map((a) => {
            const data = a.payload.doc.data() as Alert;
            data.idAlert = a.payload.doc.id;
            return data;
          });
        }),
        map((result) => result[0])
      );
  }
}
