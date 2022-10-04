import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { Comment, Post } from 'src/app/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private firestore: AngularFirestore) {}

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
        ref.orderBy('createdAt', 'asc')
      )
      .valueChanges();
  }

  addComment(idPost: string, idUser: string, body: string) {
    this.firestore.collection('posts/' + idPost + '/comments').add({
      idUser,
      body,
      createdAt: new Date(),
    });
  }
}
