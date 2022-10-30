import moment from 'moment';
import firebase from 'firebase/compat';
import { Route } from '../interfaces';

export const mapRoute = (route: Route) => {
  route.distance = route.distance / 1000;
  route.coordinates = route.coordinates.map((route: any) => {
    const routeArray = route.split(',');
    return [parseFloat(routeArray[1]), parseFloat(routeArray[0])];
  });
  const startPositionArray = (route.startPosition as string).split(',');
  route.startPosition = [
    parseFloat(startPositionArray[1]),
    parseFloat(startPositionArray[0]),
  ];
  const endPositionArray = (route.endPosition as string).split(',');
  route.endPosition = [
    parseFloat(endPositionArray[1]),
    parseFloat(endPositionArray[0]),
  ];
  route.startDate = route.startDate.toDate();
  route.endDate = route.endDate.toDate();
  const duration = moment.duration(route.timeElapsed, 'milliseconds');
  route.timeElapsed = Math.round(duration.asMinutes());
  return route;
};
