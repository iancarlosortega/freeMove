import { MercatorCoordinate } from 'mapbox-gl';
import * as turf from '@turf/turf';
import { computeCameraPosition } from './map';

export const animatePath = async ({
  map,
  duration,
  path,
  startBearing,
  startAltitude,
  pitch,
}: any) => {
  return new Promise<void>(async (resolve) => {
    const pathDistance = turf.lineDistance(path);
    let startTime: number;

    const frame = async (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const animationPhase = (currentTime - startTime) / duration;

      // when the duration is complete, resolve the promise and stop iterating
      if (animationPhase > 1) {
        resolve();
        return;
      }

      // calculate the distance along the path based on the animationPhase
      const alongPath = turf.along(path, pathDistance * animationPhase).geometry
        .coordinates;

      const lngLat = {
        lng: alongPath[0],
        lat: alongPath[1],
      };

      // Reduce the visible length of the line by using a line-gradient to cutoff the line
      // animationPhase is a value between 0 and 1 that reprents the progress of the animation
      map.setPaintProperty('line-layer', 'line-gradient', [
        'step',
        ['line-progress'],
        'yellow',
        animationPhase,
        'rgba(0, 0, 0, 0)',
      ]);

      // slowly rotate the map at a constant rate
      const bearing = startBearing - animationPhase * 200.0;

      // compute corrected camera ground position, so that he leading edge of the path is in view
      var correctedPosition = computeCameraPosition(
        pitch,
        bearing,
        lngLat,
        startAltitude,
        true // smooth
      );

      // set the pitch and bearing of the camera
      const camera = map.getFreeCameraOptions();
      camera.setPitchBearing(pitch, bearing);

      // set the position and altitude of the camera
      camera.position = MercatorCoordinate.fromLngLat(
        correctedPosition,
        startAltitude
      );

      // apply the new camera options
      map.setFreeCameraOptions(camera);

      // repeat!
      await window.requestAnimationFrame(frame);
    };

    await window.requestAnimationFrame(frame);
  });
};
