import { VehicleType } from '.';

export interface Rider {
  id?: number;
  stopArrivalDateTime?: Date;
  onVehicleId?: number;
  atStopId?: number;
  beginningStopId?: number;
  endStopId?: number;
  routeId?: number;
}
