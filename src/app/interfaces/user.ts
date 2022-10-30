import firebase from 'firebase/compat';
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
  role: UserRole;
  provider: UserProvider;
  // Datos de salud
  weight?: number;
  height?: number;
  // Datos de redes sociales
  followers?: string[];
  following?: string[];
  photoUrl?: string;
  photoFilename?: string;
  bannerUrl?: string;
  bannerFilename?: string;
}

export type UserProvider = 'email-password' | 'google.com' | 'facebook.com';
type UserRole = 'ADMIN-ROLE' | 'CLIENT-ROLE';
