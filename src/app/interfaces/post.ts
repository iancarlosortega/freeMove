import { DocumentReference } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat';
export interface Post {
  idPost: string;
  idUser: DocumentReference;
  description?: string;
  url: string;
  createdAt: firebase.firestore.Timestamp;
  likes?: DocumentReference[];
}
