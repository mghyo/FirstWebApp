import { StopService } from './stop.service';
import { StopStoreService } from './stop-store.service';

export const services: any[] = [
    StopService,
    StopStoreService
];

export * from './stop.service';
export * from './stop-store.service';
