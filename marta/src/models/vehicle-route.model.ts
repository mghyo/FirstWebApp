import { VehicleType } from './index';

export interface VehicleRoute {
  id: number;
  type: VehicleType;
  name: string;
  isCircular: boolean;
  stopIds: number[];
}
