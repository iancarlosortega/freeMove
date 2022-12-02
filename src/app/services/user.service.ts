import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  BehaviorSubject,
  combineLatest,
  finalize,
  map,
  Observable,
  of,
} from 'rxjs';
import { FileUpload } from '../models';
import { User } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Nombre de la carpeta donde se guardaran en el storage de firebase
  private basePath = '/userPhotos';

  private _user$: BehaviorSubject<User> = new BehaviorSubject({} as User);
  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  setUser(user: User) {
    this._user$.next(user);
  }

  get user$() {
    return this._user$.asObservable();
  }

  getUsers() {
    return this.firestore
      .collection('users', (ref) => ref.orderBy('createdAt', 'desc'))
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data() as User;
            data.idUser = a.payload.doc.id;
            return data;
          });
        })
      );
  }

  getSuggestedUsers() {
    return this.firestore
      .collection('users', (ref) => ref.orderBy('followers', 'desc').limit(6))
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data() as User;
            data.idUser = a.payload.doc.id;
            return data;
          });
        })
      );
  }

  getUserById(id: string) {
    return this.firestore
      .collection('users')
      .doc(id)
      .snapshotChanges()
      .pipe(
        map((a) => {
          const data = a.payload.data() as User;
          if (data) data.idUser = a.payload.id;
          return data;
        })
      );
  }

  getUserByIdNoRealtime(id: string) {
    return this.firestore
      .collection('users')
      .doc(id)
      .get()
      .pipe(
        map((a) => {
          const data = a.data() as User;
          data.idUser = a.id;
          return data;
        })
      );
  }

  getUserByEmail(email: string) {
    return this.firestore
      .collection('users', (ref) => ref.where('email', '==', email))
      .snapshotChanges()
      .pipe(
        map((result) => {
          return result.map((a) => {
            const data = a.payload.doc.data() as User;
            data.idUser = a.payload.doc.id;
            return data;
          });
        }),
        map((result) => result[0])
      );
  }

  getUsersByIds(ids: any[]) {
    if (ids.length === 0) {
      return of([]);
    }
    const users: Observable<User>[] = [];
    ids.forEach((id) => {
      const peticion = this.getUserById(id);
      users.push(peticion);
    });
    return combineLatest(users);
  }

  createUser(user: User) {
    return this.firestore.collection('users').doc(user.idUser).set(user);
  }

  updateUser(user: User) {
    return this.firestore.collection('users').doc(user.idUser).update(user);
  }

  updateProfile(fileUpload: FileUpload, user: User) {
    const filePath = `${this.basePath}/${user.photoFilename}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    //Get download URL
    uploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe((downloadURL) => {
            user.photoUrl = downloadURL;
            this.updateUser(user);
          });
        })
      )
      .subscribe();

    return uploadTask.percentageChanges();
  }

  updateBanner(fileUpload: FileUpload, user: User) {
    const filePath = `/userBanners/${user.bannerFilename}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    //Get download URL
    uploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe((downloadURL) => {
            this.firestore.collection('users').doc(user.idUser).update({
              bannerFilename: user.bannerFilename,
              bannerUrl: downloadURL,
            });
          });
        })
      )
      .subscribe();

    return uploadTask.percentageChanges();
  }

  toggleRole(idUser: string, role: string) {
    return this.firestore.collection('users').doc(idUser).update({
      role,
    });
  }
}
