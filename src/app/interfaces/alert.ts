export interface SecurityAlert {
  idAlert: string;
  idUser: string;
  isActive: boolean;
  linkedAccount?: string;
  startTime?: number;
  endTime?: number;
  timeElapsed?: number;
  coordinates?: [number, number][];
}
