export interface Incident {
  idIncident: string;
  idRoute: string;
  title: string;
  description: string;
  city: string;
  isActive: boolean;
  type: string;
  createdAt: number;
  position: [number, number];
  keywords: string[];
  photos: string[];
}
