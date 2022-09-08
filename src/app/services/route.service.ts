import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { Route } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  constructor(
    private firestore: AngularFirestore,
    private toastrService: ToastrService
  ) {}

  getRoutes() {
    return this.firestore
      .collection('routes')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data() as Route;
            data.idRoute = a.payload.doc.id;
            return data;
          });
        })
      );
  }

  getRoutesByUser(idUser: string) {
    return this.firestore
      .collection('routes', (ref) => ref.where('idUser', '==', idUser))
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data() as Route;
            data.idRoute = a.payload.doc.id;
            return data;
          });
        })
      );
  }

  getRouteById(id: string) {
    return this.firestore
      .collection('routes')
      .doc(id)
      .snapshotChanges()
      .pipe(
        map((a) => {
          const data = a.payload.data() as Route;
          return data;
        })
      );
  }

  deleteRoute(id: string) {
    this.firestore
      .collection('routes')
      .doc(id)
      .delete()
      .then(() => {
        this.toastrService.success('Ruta eliminada correctamente');
      })
      .catch((error) => {
        console.log(error);
        this.toastrService.error('Error al eliminar la ruta');
      });
  }

  deleteRoutesByUser(idUser: string) {
    this.firestore
      .collection('routes', (ref) => ref.where('idUser', '==', idUser))
      .get()
      .subscribe((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
      });
  }
}
