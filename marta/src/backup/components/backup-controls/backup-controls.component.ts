import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Router } from '@angular/router';

import * as fromServices from '../../services';

@Component({
  selector: 'app-backup-controls',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./backup-controls.component.scss'],
  template: `
        <div class="backup-container">
            <button [disabled]="disableButtons" type="button" class="btn btn-primary" (click)="loadClick()">Load Data From file</button>
            <button [disabled]="disableButtons" type="button" class="btn btn-primary" (click)="saveClick()">Save Current State</button>
            <button [disabled]="disableButtons" type="button" class="btn btn-danger" (click)="resetClick()">Reset</button>
        </div>
    `
})
export class BackupControlsComponent {
  @Input() disableButtons: boolean;

  constructor(
    private router: Router,
    private backupStoreService: fromServices.BackupStoreService
  ) {}

  loadClick(): void {
    this.backupStoreService.loadData('stoptable', '');
  }
  saveClick(): void {
    this.router.navigateByUrl('/save-data-form');
  }
  resetClick(): void {
    this.backupStoreService.resetSimulation();
  }
}
