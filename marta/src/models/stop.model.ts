import { VehicleType } from './';

export interface Stop {
    type?: VehicleType;
    id?: number;
    name?: string;
    xCoordinate?: number;
    yCoordinate?: number;
    riderCapacity?: number;
    riderIds?: number[];
}
