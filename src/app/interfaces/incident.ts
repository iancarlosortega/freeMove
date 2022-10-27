import firebase from 'firebase/compat';
export interface Incident {
  idIncident: string;
  idRoute: string;
  title: string;
  description: string;
  city: string;
  isActive: boolean;
  category: string;
  // createdAt?: firebase.firestore.Timestamp;
  createdAt: any;
  position: [number, number];
  keywords: string[];
  photos: string[];
}
