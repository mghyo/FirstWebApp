import { Component, OnInit, Input } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import * as fromServices from '../../services';
import * as fromVehicleRouteServices from '../../../vehicle-routes/services';
import { Stop, VehicleRoute, VehicleType } from '../../../models';

@Component({
  selector: 'app-stop-table',
  styleUrls: ['./stop-table.component.scss'],
  template: `
    <div class="card card-table">
      <div class="card-header">{{ getHeader() }}</div>
      <div class="card-body">
        <table class="table table-striped table-borderless">
          <thead>
            <tr>
              <th>Stop Name</th>
            </tr>
          </thead>
          <tbody class="no-border-x">
            <tr *ngFor="let stop of (stops$ | async)">
              <th>{{ stop.name }}</th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class StopTableComponent implements OnInit {
  public stops$: Observable<Stop[]>;

  @Input() public type: VehicleType;

  constructor(private stopStoreService: fromServices.StopStoreService) {}

  ngOnInit() {
    if (this.type === VehicleType.BUS) {
      this.stops$ = this.stopStoreService.getBusStops$();
    } else if (this.type === VehicleType.TRAIN) {
      this.stops$ = this.stopStoreService.getTrainStops$();
    }
  }

  public getHeader(): string {
    if (this.type === VehicleType.BUS) {
      return 'Bus Stops';
    } else if (this.type === VehicleType.TRAIN) {
      return 'Train Stops';
    }
  }
}
