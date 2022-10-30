import firebase from 'firebase/compat';
export interface Comment {
  idComment: string;
  idUser: string;
  body: string;
  createdAt: firebase.firestore.Timestamp;
}
