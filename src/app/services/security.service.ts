import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmAlertComponent } from 'src/app/dashboard/components/confirm-alert/confirm-alert.component';
import { StopAlertComponent } from 'src/app/dashboard/components/stop-alert/stop-alert.component';
import { SecurityAlert } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  constructor(
    public dialog: MatDialog,
    private toastr: ToastrService,
    private firestore: AngularFirestore,
    private router: Router
  ) {}

  activateAlert(idUser: string) {
    const dialog = this.dialog.open(ConfirmAlertComponent, {
      width: '400px',
    });

    dialog.afterClosed().subscribe((result: boolean) => {
      if (!result) return;

      this.getAlertByUser(idUser).subscribe((alert) => {
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

        this.firestore.collection('alerts').doc(alert.idAlert).update({
          isActive: true,
          startTime: Date.now(),
        });
      });
    });
  }

  desactivateAlert(idAlert: string) {
    const dialog = this.dialog.open(StopAlertComponent, {
      width: '400px',
    });

    dialog.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.firestore.collection('alerts').doc(idAlert).update({
          isActive: false,
          endTime: Date.now(),
          //TODO: Calcular el tiempo transcurrido
          timeElapsed: 111,
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

  getAlertByUser(idUser: string) {
    return this.firestore
      .collection('alerts', (ref) => ref.where('idUser', '==', idUser))
      .snapshotChanges()
      .pipe(
        map((result) => {
          return result.map((a) => {
            const data = a.payload.doc.data() as SecurityAlert;
            data.idAlert = a.payload.doc.id;
            return data;
          });
        }),
        map((result) => result[0])
      );
  }
}
