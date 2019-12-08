import { VehicleService } from './vehicle.service';
import { VehicleStoreService } from './vehicle-store.service';

export const services: any[] = [
    VehicleService,
    VehicleStoreService
];

export * from './vehicle.service';
export * from './vehicle-store.service';
