import { Injectable } from '@angular/core';
import firebase from '@firebase/app-compat';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class FollowService {
  constructor(private firestore: AngularFirestore) {}

  async follow(idProfile: string, idCurrentUser: string) {
    return this.firestore
      .collection('users')
      .doc(idCurrentUser)
      .update({
        following: firebase.firestore.FieldValue.arrayUnion(idProfile),
      })
      .then(() => {
        this.firestore
          .collection('users')
          .doc(idProfile)
          .update({
            followers: firebase.firestore.FieldValue.arrayUnion(idCurrentUser),
          });
      });
  }

  async unfollow(idProfile: string, idCurrentUser: string) {
    return this.firestore
      .collection('users')
      .doc(idCurrentUser)
      .update({
        following: firebase.firestore.FieldValue.arrayRemove(idProfile),
      })
      .then(() => {
        this.firestore
          .collection('users')
          .doc(idProfile)
          .update({
            followers: firebase.firestore.FieldValue.arrayRemove(idCurrentUser),
          });
      });
  }
}
