import { Injectable } from '@angular/core';
import firebase from '@firebase/app-compat';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  constructor(private firestore: AngularFirestore) {}

  addLike(idPost: string, idUser: string) {
    return this.firestore
      .collection('posts')
      .doc(idPost)
      .update({
        likes: firebase.firestore.FieldValue.arrayUnion(
          this.firestore.doc(`/users/${idUser}`).ref
        ),
      })
      .then(() => {
        this.firestore
          .collection('users')
          .doc(idUser)
          .update({
            likes: firebase.firestore.FieldValue.arrayUnion(
              this.firestore.doc(`/posts/${idPost}`).ref
            ),
          });
      });
  }

  removeLike(idPost: string, idUser: string) {
    return this.firestore
      .collection('posts')
      .doc(idPost)
      .update({
        likes: firebase.firestore.FieldValue.arrayRemove(
          this.firestore.doc(`/users/${idUser}`).ref
        ),
      })
      .then(() => {
        this.firestore
          .collection('users')
          .doc(idUser)
          .update({
            likes: firebase.firestore.FieldValue.arrayRemove(
              this.firestore.doc(`/posts/${idPost}`).ref
            ),
          });
      });
  }
}
