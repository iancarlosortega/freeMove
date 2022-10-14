export interface Incident {
  idIncident: string;
  idRoute: string;
  title: string;
  description: string;
  city: string;
  isActive: boolean;
  category: string;
  createdAt: number;
  position: [number, number];
  keywords: string[];
  photos: string[];
}
