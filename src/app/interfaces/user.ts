export interface User {
  idUser: string;
  // Datos de registro
  name: string;
  email: string;
  password?: string;
  password2?: string;
  // Datos adicionales
  phone?: string;
  gender?: string;
  identificationCard?: string;
  country?: string;
  city?: string;
  photoUrl?: string;
  photoFilename?: string;
  file?: string;
  role: UserRole;
  provider: UserProvider;
  // Datos de salud
  weight?: number;
  height?: number;
  // Datos de redes sociales
  followers?: number;
  following?: number;
}

export type UserProvider = 'email-password' | 'google.com' | 'facebook.com';
type UserRole = 'ADMIN-ROLE' | 'CLIENT-ROLE';
