import { DocumentReference } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat';
export interface Comment {
  idComment: string;
  idUser: DocumentReference;
  body: string;
  createdAt: firebase.firestore.Timestamp;
}
