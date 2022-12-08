import firebase from 'firebase/compat';
import { DocumentReference } from '@angular/fire/compat/firestore';
export interface User {
  idUser: string;
  // Datos de registro
  name: string;
  email: string;
  createdAt?: firebase.firestore.Timestamp;
  password?: string;
  password2?: string;
  // Datos adicionales
  age?: number;
  phone?: string;
  gender?: string;
  identificationCard?: string;
  country?: string;
  city?: string;
  canton?: string;
  role: UserRole;
  provider: UserProvider;
  // Datos de salud
  weight?: number;
  height?: number;
  // Datos de redes sociales
  followers?: DocumentReference[];
  following?: DocumentReference[];
  likes?: DocumentReference[];
  photoUrl?: string;
  photoFilename?: string;
  bannerUrl?: string;
  bannerFilename?: string;
}

export type UserProvider = 'email-password' | 'google.com' | 'facebook.com';
type UserRole = 'ADMIN-ROLE' | 'CLIENT-ROLE';
