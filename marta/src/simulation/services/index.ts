import { SimulationService } from './simulation.service';
import { SimulationStoreService } from './simulation-store.service';

export const services: any[] = [
    SimulationService,
    SimulationStoreService
];

export * from './simulation.service';
export * from './simulation-store.service';
