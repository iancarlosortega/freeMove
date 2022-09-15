export interface Route {
  idRoute: string;
  idUser: string;
  name: string;
  distance: number;
  type: string;
  city: string;
  //TODO: Cambiar date por time
  startPosition: [number, number];
  startDate: Date;
  endPosition: [number, number];
  endDate: Date;
  coordinates: [number, number][];
  burnoutCalories: number;
  timeElapsed: number;
  timeInMoving: number;
  velocityAvg: number;
  velocityMax: number;
  activityType: string;
}
