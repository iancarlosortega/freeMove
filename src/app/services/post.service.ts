import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { BehaviorSubject, map, Observable, scan, take, tap } from 'rxjs';
import { Comment } from 'src/app/interfaces';

interface QueryConfig {
  path: string; //  path to collection
  field: string; // field to orderBy
  limit: number; // limit per query
  reverse: boolean; // reverse order?
  prepend: boolean; // prepend to source?
}

@Injectable({
  providedIn: 'root',
})
export class PostService {
  // Source data
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject([]);

  private query: QueryConfig = {
    path: 'posts',
    field: 'createdAt',
    limit: 2,
    reverse: false,
    prepend: false,
  };

  // Observable data
  data!: Observable<any>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();

  constructor(private firestore: AngularFirestore) {}

  // Initial query sets options and defines the Observable
  // passing opts will override the defaults
  init(path: string, field: string, opts?: any) {
    this.query = {
      path,
      field,
      limit: 6,
      reverse: false,
      prepend: false,
      ...opts,
    };

    const first = this.firestore.collection(this.query.path, (ref) => {
      return ref
        .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit);
    });

    this.mapAndUpdate(first);

    // Create the observable array for consumption in components
    this.data = this._data.asObservable().pipe(
      scan((acc, val) => {
        return this.query.prepend ? val.concat(acc) : acc.concat(val);
      })
    );
  }

  // Retrieves additional data from firestore
  more() {
    const cursor = this.getCursor();

    const more = this.firestore.collection(this.query.path, (ref) => {
      return ref
        .orderBy(this.query.field, this.query.reverse ? 'desc' : 'asc')
        .limit(this.query.limit)
        .startAfter(cursor);
    });
    this.mapAndUpdate(more);
  }

  // Determines the doc snapshot to paginate query
  private getCursor() {
    const current: any = this._data.value;
    if (current.length) {
      return this.query.prepend
        ? current[0].doc
        : current[current.length - 1].doc;
    }
    return null;
  }

  // Maps the snapshot to usable format the updates source
  private mapAndUpdate(col: AngularFirestoreCollection<any>) {
    if (this._done.value || this._loading.value) {
      return;
    }

    // loading
    this._loading.next(true);

    // Map snapshot with doc ref (needed for cursor)
    return col
      .snapshotChanges()
      .pipe(
        tap((arr) => {
          let values: any = arr.map((snap) => {
            const data = snap.payload.doc.data();
            const doc = snap.payload.doc;
            return { ...data, doc };
          });

          // If prepending, reverse the batch order
          values = this.query.prepend ? values.reverse() : values;
          // update source with new values, done loading
          this._data.next(values);
          this._loading.next(false);

          // no more values, mark done
          if (!values.length) {
            this._done.next(true);
          }
        }),
        take(1)
      )
      .subscribe();
  }

  //TODO: Script to update
  updateIdUserToRef() {
    return this.firestore
      .collection('posts')
      .get()
      .subscribe((querySnapshot) => {
        querySnapshot.forEach((doc: any) => {
          const data = doc.data();
          this.firestore
            .collection('posts')
            .doc(doc.id)
            .update({ idUser: this.firestore.doc('users/' + data.idUser).ref });
        });
      });
  }

  getProfilePosts(idUser: string) {
    return this.firestore
      .collection('posts', (ref) =>
        ref.where('idUser', '==', idUser).orderBy('createdAt', 'desc')
      )
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
      idUser: this.firestore.doc('users/' + idUser).ref,
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
