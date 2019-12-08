import { RiderService } from './rider.service';
import { RiderStoreService } from './rider-store.service';

export const services: any[] = [
    RiderService,
    RiderStoreService
];

export * from './rider.service';
export * from './rider-store.service';
