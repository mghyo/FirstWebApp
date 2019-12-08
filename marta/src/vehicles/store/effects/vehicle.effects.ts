import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as fromActions from '../actions';
import * as fromServices from '../../services';

import { Vehicle } from '../../../models';

@Injectable()
export class VehiclesEffects {
  private vehicle: Vehicle;

  constructor(
    private actions$: Actions,
    private vehicleService: fromServices.VehicleService
  ) {}

  @Effect()
  addVehicleEffect$ = this.actions$.ofType(fromActions.ADD_VEHICLE)
    .pipe(
      map((action: fromActions.AddVehicle) => action.payload),
      switchMap((vehicle: Vehicle) => {
        this.vehicle = vehicle;
        return this.vehicleService.getNewVehicleId()
          .pipe(
            map((id: number) => {
              this.vehicle.id = id;
              return new fromActions.AddVehicleSuccess(this.vehicle);
            })
          );
      })
    );

  @Effect({ dispatch: false })
  addVehicleSuccessEffect$ = this.actions$.ofType(fromActions.ADD_VEHICLE_SUCCESS)
    .pipe(
      map((action: fromActions.AddVehicleSuccess) => action.payload),
      switchMap((vehicle: Vehicle) => {
        return this.vehicleService.addVehicle(vehicle)
          .pipe(
            catchError(error => of(new fromActions.AddVehicleFail(error)))
          );
      })
    );

  @Effect()
  loadVehiclesEffect$ = this.actions$.ofType(fromActions.LOAD_VEHICLES).pipe(
    switchMap(() => {
      return this.vehicleService
        .loadVehicles()
        .pipe(
          map((vehicles: Vehicle[]) => new fromActions.LoadVehiclesSuccess(vehicles)),
          catchError(error => of(new fromActions.LoadVehiclesFail(error)))
        );
    })
  );
}
