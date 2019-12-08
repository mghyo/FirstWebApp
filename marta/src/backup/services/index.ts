import { BackupService } from './backup.service';
import { BackupStoreService } from './backup-store.service';

export const services: any[] = [
    BackupService,
    BackupStoreService
];

export * from './backup.service';
export * from './backup-store.service';
