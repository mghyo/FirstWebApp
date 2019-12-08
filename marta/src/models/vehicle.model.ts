import { VehicleType } from './';

export interface Vehicle {
  type: VehicleType;
  id: number;
  routeId: number;
  nextStopId: number;
  currentStopId: number;
  atStop: boolean;
  capacity: number;
  minutesTillArrival: number;
  minutesTillDeparting: number;
  traverseStopsUp: boolean;
  riderIds: number[];
}
