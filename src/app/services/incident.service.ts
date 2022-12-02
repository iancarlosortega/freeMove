import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { catchError, map, of } from 'rxjs';
import { Incident } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class IncidentService {
  constructor(private firestore: AngularFirestore) {}

  getIncidents() {
    return this.firestore
      .collection('incidents')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data() as Incident;
            data.idIncident = a.payload.doc.id;
            return data;
          });
        })
      );
  }

  getRecentIncidents() {
    return this.firestore
      .collection('incidents', (ref) =>
        ref.orderBy('createdAt', 'desc').limit(10)
      )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data() as Incident;
            data.idIncident = a.payload.doc.id;
            return data;
          });
        })
      );
  }

  getActiveIncidents() {
    return this.firestore
      .collection('incidents', (ref) => ref.where('isActive', '==', true))
      .snapshotChanges()
      .pipe(
        map((result) => {
          return result.map((a) => {
            const data = a.payload.doc.data() as Incident;
            data.idIncident = a.payload.doc.id;
            return data;
          });
        })
      );
  }

  getIncidentById(id: string) {
    return this.firestore
      .collection('incidents')
      .doc(id)
      .snapshotChanges()
      .pipe(
        map((a) => {
          const data = a.payload.data() as Incident;
          data.idIncident = a.payload.id;
          return data;
        }),
        catchError((error) => {
          return of(null);
        })
      );
  }

  getIncidentsFromRoute(idRoute: string) {
    return this.firestore
      .collection('incidents', (ref) => ref.where('idRoute', '==', idRoute))
      .snapshotChanges()
      .pipe(
        map((result) => {
          return result.map((a) => {
            const data = a.payload.doc.data() as Incident;
            data.idIncident = a.payload.doc.id;
            return data;
          });
        }),
        catchError((error) => {
          console.log(error);
          return [];
        })
      );
  }

  toggleIncidentStatus(id: string, newStatus: boolean) {
    return this.firestore
      .collection('incidents')
      .doc(id)
      .update({ isActive: newStatus });
  }
}
