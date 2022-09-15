export interface Incident {
  idIncident: string;
  idRoute: string;
  title: string;
  description: string;
  type: string;
  createdAt: number;
  position: [number, number];
}
