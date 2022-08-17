import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, map, Subject } from 'rxjs';
import { User } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // private _user$: Subject<User> = new Subject();
  private _user$: BehaviorSubject<User> = new BehaviorSubject({} as User);

  constructor(private firestore: AngularFirestore) {}

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
}
