import { Component, OnInit } from '@angular/core';

import * as fromSimulation from '../../../simulation';
import * as fromStops from '../../../stops';
import * as fromVehicles from '../../../vehicles';
import * as fromVehicleRoutes from '../../../vehicle-routes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'CS6310 Marta Simulation';

  constructor(
    private simulationStoreService: fromSimulation.SimulationStoreService,
    private stopStoreService: fromStops.StopStoreService,
    private vehicleStoreService: fromVehicles.VehicleStoreService,
    private vehicleRouteStoreService: fromVehicleRoutes.VehicleRouteStoreService
  ) {}

  ngOnInit() {
    this.simulationStoreService.loadDatetime();
    this.stopStoreService.loadStops();
    this.vehicleStoreService.loadVehicles();
    this.vehicleRouteStoreService.loadVehicleRoutes();
  }
}
