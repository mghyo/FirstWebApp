import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';

import { Observable } from 'rxjs/Observable';

import * as fromServices from '../../services';
import * as fromStopServices from '../../../stops/services';
import * as fromVehicleRouteServices from '../../../vehicle-routes/services';
import { Vehicle, VehicleType, VehicleRoute, Stop } from '../../../models';

@Component({
  selector: 'app-vehicle-table',
  styleUrls: ['./vehicle-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card card-table">
      <div class="card-header">{{ getHeader() }}</div>
      <div class="card-body">
        <table class="table table-striped table-borderless">
          <thead>
            <tr>
              <th>Route Name</th>
              <th class="number">Arriving In</th>
              <th>Next Stop</th>
              <th class="number">Riders</th>
            </tr>
          </thead>
          <tbody class="no-border-x">
            <tr *ngFor="let vehicle of (vehicles$ | async)">
              <th>{{ getRouteName((routeEntities$ | async), vehicle.routeId) }}</th>
              <th class="number">{{ vehicle.minutesTillArrival }}mins</th>
              <th>{{ getStopName((stopEntities$ | async), vehicle.nextStopId) }}</th>
              <th class="number">{{ getRiderCount(vehicle.riderIds) }}</th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class VehicleTableComponent implements OnInit {
  public vehicles$: Observable<Vehicle[]>;
  private routeEntities$: Observable<{ [id: number]: VehicleRoute }>;
  private stopEntities$: Observable<{ [id: number]: Stop }>;

  @Input() public type: VehicleType;

  constructor(
    private vehicleStoreService: fromServices.VehicleStoreService,
    private stopStoreService: fromStopServices.StopStoreService,
    private vehicleRouteStoreService: fromVehicleRouteServices.VehicleRouteStoreService
  ) {
    this.routeEntities$ = this.vehicleRouteStoreService.getVehicleRoutesEntities$();
    this.stopEntities$ = this.stopStoreService.getStopsEntities$();
  }

  ngOnInit() {
    if (this.type === VehicleType.BUS) {
      this.vehicles$ = this.vehicleStoreService.getBuses$();
    } else if (this.type === VehicleType.TRAIN) {
      this.vehicles$ = this.vehicleStoreService.getTrains$();
    }
  }

  public getHeader(): string {
    if (this.type === VehicleType.BUS) {
      return 'Buses';
    } else if (this.type === VehicleType.TRAIN) {
      return 'Trains';
    }
  }

  public getRouteName(
    routeEntities: { [id: number]: VehicleRoute },
    routeId: number
  ): string {
    return routeEntities && routeEntities[routeId]
      ? routeEntities[routeId].name
      : '';
  }

  public getStopName(
    stopEntities: { [id: number]: Stop },
    stopId: number
  ): string {
    return stopEntities && stopEntities[stopId]
      ? stopEntities[stopId].name
      : '';
  }

  public getRiderCount(riders: number[]): number {
    return riders ? riders.length : 0;
  }
}
