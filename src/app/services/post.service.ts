import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { Comment, Post } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private firestore: AngularFirestore) {}

  getAllPosts() {
    return this.firestore
      .collection('posts', (ref) => ref.orderBy('createdAt', 'desc').limit(6))
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data() as Post;
            data.idPost = a.payload.doc.id;
            return data;
          });
        })
      );
  }

  getPostById(id: string) {
    return this.firestore
      .collection('posts')
      .doc(id)
      .snapshotChanges()
      .pipe(
        map((a) => {
          const data = a.payload.data() as Post;
          data.idPost = a.payload.id;
          return data;
        })
      );
  }

  getProfilePosts(idUser: string) {
    return this.firestore
      .collection('posts', (ref) =>
        ref.where('idUser', '==', idUser).orderBy('createdAt', 'desc')
      )
      .valueChanges();
  }

  getMostLikedPosts() {
    return this.firestore
      .collection('posts', (ref) => ref.orderBy('totalLikes', 'desc').limit(3))
      .valueChanges();
  }

  getCommentsFromPost(idPost: string) {
    return this.firestore
      .collection<Comment>('posts/' + idPost + '/comments', (ref) =>
        ref.orderBy('createdAt', 'desc')
      )
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data = a.payload.doc.data() as Comment;
            data.idComment = a.payload.doc.id;
            return data;
          });
        })
      );
  }

  deletePost(idPost: string) {
    return this.firestore.collection('posts').doc(idPost).delete();
  }

  addComment(idPost: string, idUser: string, body: string) {
    this.firestore.collection('posts/' + idPost + '/comments').add({
      idUser,
      body,
      createdAt: new Date(),
    });
  }

  deleteComment(idPost: string, idComment: string) {
    this.firestore
      .collection('posts/' + idPost + '/comments')
      .doc(idComment)
      .delete();
  }
}
