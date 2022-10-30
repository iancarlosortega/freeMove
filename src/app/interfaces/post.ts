import firebase from 'firebase/compat';
export interface Post {
  idPost: string;
  idUser: string;
  description?: string;
  url: string;
  createdAt: firebase.firestore.Timestamp;
}
