import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../../app/app.module';
import * as fromActions from '../store/actions';
import * as fromSelectors from '../store/selectors';

import { VehicleRoute } from '../../models';

@Injectable()
export class VehicleRouteStoreService {
  constructor(private store: Store<fromRoot.ApplicationState>) {}

  public addVehicleRoute(vehicleRoute: VehicleRoute): void {
    this.store.dispatch(new fromActions.AddVehicleRoute(vehicleRoute));
  }

  public loadVehicleRoutes(): void {
    this.store.dispatch(new fromActions.LoadVehicleRoutes());
  }

  public getVehicleRoutes$(): Observable<VehicleRoute[]> {
    return this.store.select(fromSelectors.getVehicleRoutes);
  }

  public getVehicleRoutesEntities$(): Observable<{ [id: number]: VehicleRoute }> {
    return this.store.select(fromSelectors.getVehicleRouteEntities);
  }

  public getTrainRoutes$(): Observable<VehicleRoute[]> {
    return this.store.select(fromSelectors.getTrainRoutes);
  }

  public getBusRoutes$(): Observable<VehicleRoute[]> {
    return this.store.select(fromSelectors.getBusRoutes);
  }
}
