import { Injectable } from '@angular/core';
import firebase from '@firebase/app-compat';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class FollowService {
  constructor(private firestore: AngularFirestore) {}

  follow(idProfile: string, idCurrentUser: string) {
    return this.firestore
      .collection('users')
      .doc(idCurrentUser)
      .update({
        following: firebase.firestore.FieldValue.arrayUnion(
          this.firestore.doc(`/users/${idProfile}`).ref
        ),
      })
      .then(() => {
        this.firestore
          .collection('users')
          .doc(idProfile)
          .update({
            followers: firebase.firestore.FieldValue.arrayUnion(
              this.firestore.doc(`/users/${idCurrentUser}`).ref
            ),
          });
      });
  }

  unfollow(idProfile: string, idCurrentUser: string) {
    return this.firestore
      .collection('users')
      .doc(idCurrentUser)
      .update({
        following: firebase.firestore.FieldValue.arrayRemove(
          this.firestore.doc(`/users/${idProfile}`).ref
        ),
      })
      .then(() => {
        this.firestore
          .collection('users')
          .doc(idProfile)
          .update({
            followers: firebase.firestore.FieldValue.arrayRemove(
              this.firestore.doc(`/users/${idCurrentUser}`).ref
            ),
          });
      });
  }
}
