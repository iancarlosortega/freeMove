export interface Route {
  idRoute: string;
  idUser: string;
  name: string;
  distance: number;
  calification: number;
  difficulty: RouteDifficulty;
  photos: PhotoRoute[];
  keywords: string[];
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
  count?: number;
}

export interface PhotoRoute {
  latitude: number;
  longitude: number;
  photoUrl: string;
}

type RouteDifficulty = 'Fácil' | 'Medio' | 'Difícil';
