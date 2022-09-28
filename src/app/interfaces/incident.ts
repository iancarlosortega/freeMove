export interface Incident {
  idIncident: string;
  idRoute: string;
  title: string;
  description: string;
  isActive: boolean;
  type: string;
  createdAt: number;
  position: [number, number];
  photos: string[];
}
