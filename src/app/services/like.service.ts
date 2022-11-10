import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { combineLatest, Observable, of } from 'rxjs';
import { Post } from '../interfaces';
import { PostService } from './post.service';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  constructor(
    private firestore: AngularFirestore,
    private postService: PostService
  ) {}

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

  getPostsLiked(ids: any[]) {
    if (ids.length === 0) {
      return of([]);
    }
    const posts: Observable<Post>[] = [];
    ids.forEach((id) => {
      const peticion = this.postService.getPostById(id.idPost);
      posts.push(peticion);
    });
    return combineLatest(posts);
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
