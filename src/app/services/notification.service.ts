import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Notification } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private firestore: AngularFirestore) {}

  getNotificationById(id: string) {
    return this.firestore
      .collection('notifications')
      .doc(id)
      .snapshotChanges()
      .pipe(
        map((a) => {
          const data = a.payload.data() as Notification;
          data.idNotification = a.payload.id;
          return data;
        })
      );
  }

  getNotificationsByUser(idUser: string) {
    return this.firestore
      .collection('notifications', (ref) => ref.where('idUser', '==', idUser))
      .snapshotChanges()
      .pipe(
        map((result) => {
          return result.map((a) => {
            const data = a.payload.doc.data() as Notification;
            data.idNotification = a.payload.doc.id;
            return data;
          });
        })
      );
  }

  getNotificationByAlert(idAlert: string) {
    return this.firestore
      .collection('notifications', (ref) => ref.where('idAlert', '==', idAlert))
      .snapshotChanges()
      .pipe(
        map((result) => {
          return result.map((a) => {
            const data = a.payload.doc.data() as Notification;
            data.idNotification = a.payload.doc.id;
            return data;
          });
        }),
        map((result) => {
          return result[0];
        })
      );
  }

  createNotification(notification: Notification) {
    return this.firestore.collection('notifications').add(notification);
  }
}
