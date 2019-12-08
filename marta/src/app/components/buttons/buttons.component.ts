import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import * as fromSimulation from '../../../simulation';
import { VehicleType } from '../../../models';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent {
  disabled$: Observable<boolean>;

  constructor(
    private router: Router,
    private simulationStoreService: fromSimulation.SimulationStoreService
  ) {
    this.disabled$ = this.simulationStoreService.getDisabled$();
  }

  busClick = () => this.router.navigateByUrl(`/add-vehicle/${VehicleType.BUS}`);
  trainClick = () =>
    this.router.navigateByUrl(`/add-vehicle/${VehicleType.TRAIN}`);
  busStopClick = () =>
    this.router.navigateByUrl(`/add-stop/${VehicleType.BUS}`);
  trainStopClick = () =>
    this.router.navigateByUrl(`/add-stop/${VehicleType.TRAIN}`);
  busRouteClick = () =>
    this.router.navigateByUrl(`/add-vehicle-route/${VehicleType.BUS}`);
  trainRouteClick = () =>
    this.router.navigateByUrl(`/add-vehicle-route/${VehicleType.TRAIN}`);
  riderClick = () => this.router.navigateByUrl(`/add-rider`);
}
