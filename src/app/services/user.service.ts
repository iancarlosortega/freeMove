import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, finalize, map } from 'rxjs';
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

  getUserById(id: string) {
    return this.firestore
      .collection('users')
      .doc(id)
      .snapshotChanges()
      .pipe(
        map((a) => {
          const data = a.payload.data() as User;
          return data;
        })
      );
  }

  createUser(user: User) {
    return this.firestore.collection('users').doc(user.idUser).set(user);
  }

  updateUser(user: User) {
    return this.firestore.collection('users').doc(user.idUser).update(user);
  }

  updateProfile(fileUpload: FileUpload, fileName: string, usuarioData: User) {
    const filePath = `${this.basePath}/${fileName}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    //Get download URL
    uploadTask
      .snapshotChanges()
      .pipe(
        finalize(() => {
          storageRef.getDownloadURL().subscribe((downloadURL) => {
            usuarioData.photoUrl = downloadURL;
            this.updateUser(usuarioData);
          });
        })
      )
      .subscribe();

    return uploadTask.percentageChanges();
  }
}
