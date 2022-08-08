export interface User {
  idUser: string;
  // Datos de registro
  firstName: string;
  lastName: string;
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
  role: UserRole;
  // Datos de salud
  weight?: number;
  height?: number;
  // Datos de redes sociales
  followers?: number;
  following?: number;
}

type UserRole = 'ADMIN-ROLE' | 'CLIENT-ROLE';
