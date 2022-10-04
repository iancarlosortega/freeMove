import moment from 'moment';
import { Route } from '../interfaces';

export const mapRoute = (route: Route) => {
  route.coordinates = route.coordinates.map((route: any) =>
    route.split(',').map((coord: any) => parseFloat(coord))
  );
  route.startDate = route.startDate.toDate();
  route.endDate = route.endDate.toDate();
  const duration = moment.duration(route.timeElapsed, 'milliseconds');
  route.timeElapsed = Math.round(duration.asMinutes());
  return route;
};
