import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  constructor(private firestore: AngularFirestore) {}

  getLikesFromPost(idPost: string) {
    return this.firestore
      .collection('posts/' + idPost + '/likes')
      .valueChanges();
  }

  getUserLikes(idUser: string) {
    return this.firestore
      .collection('users/' + idUser + '/likes')
      .valueChanges();
  }

  addLike(idPost: string, idUser: string) {
    this.firestore.doc('posts/' + idPost + '/likes/' + idUser).set({
      idUser,
    });
    this.firestore.doc('users/' + idUser + '/likes/' + idPost).set({
      idPost,
    });
  }

  removeLike(idPost: string, idUser: string) {
    this.firestore.doc('posts/' + idPost + '/likes/' + idUser).delete();
    this.firestore.doc('users/' + idUser + '/likes/' + idPost).delete();
  }
}
