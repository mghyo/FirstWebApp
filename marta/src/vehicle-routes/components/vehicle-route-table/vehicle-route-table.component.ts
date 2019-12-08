import { Component, OnInit, Input } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import * as fromServices from '../../services';
import * as fromStopServices from '../../../stops/services';
import { Stop, VehicleRoute, VehicleType } from '../../../models';

@Component({
  selector: 'app-vehicle-route-table',
  styleUrls: ['./vehicle-route-table.component.scss'],
  template: `
    <div class="card card-table">
      <div class="card-header">{{ getHeader() }}</div>
      <div class="card-body">
        <table class="table table-striped table-borderless">
          <thead>
            <tr>
              <th>Route Name</th>
              <th>Stops</th>
            </tr>
          </thead>
          <tbody class="no-border-x">
            <tr *ngFor="let route of (routes$ | async)">
              <th>{{ route.name }}</th>
              <th>{{ getStopNames(route.stopIds) }}</th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class VehicleRouteTableComponent implements OnInit {
  public routes$: Observable<VehicleRoute[]>;
  private stopEntities: { [id: number]: Stop };

  @Input() public type: VehicleType;

  constructor(
    private vehicleRouteStoreService: fromServices.VehicleRouteStoreService,
    private stopStoreService: fromStopServices.StopStoreService
  ) {
    this.stopStoreService.getStopsEntities$().subscribe((entities: { [id: number]: Stop }) => {
      this.stopEntities = entities;
    });
  }

  ngOnInit() {
    if (this.type === VehicleType.BUS) {
      this.routes$ = this.vehicleRouteStoreService.getBusRoutes$();
    } else if (this.type === VehicleType.TRAIN) {
      this.routes$ = this.vehicleRouteStoreService.getTrainRoutes$();
    }
  }

  public getHeader(): string {
    if (this.type === VehicleType.BUS) {
      return 'Bus Routes';
    } else if (this.type === VehicleType.TRAIN) {
      return 'Train Routes';
    }
  }

  public getStopNames(stopIds: number[]): string[] {
    return stopIds.map((id: number) => this.stopEntities[id].name);
  }
}
