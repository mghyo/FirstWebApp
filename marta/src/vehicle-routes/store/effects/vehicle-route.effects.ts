import { Injectable, Inject } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as fromActions from '../actions';
import * as fromServices from '../../services';

import { VehicleRoute } from '../../../models';

@Injectable()
export class VehicleRoutesEffects {
  private vehicleRoute: VehicleRoute;

  constructor(
    private actions$: Actions,
    private vehicleRouteService: fromServices.VehicleRouteService
  ) {}

  @Effect()
  addVehicleRouteEffect$ = this.actions$.ofType(fromActions.ADD_VEHICLE_ROUTE)
    .pipe(
      map((action: fromActions.AddVehicleRoute) => action.payload),
      switchMap((vehicleRoute: VehicleRoute) => {
        this.vehicleRoute = vehicleRoute;
        return this.vehicleRouteService.getNewVehicleRouteId()
          .pipe(
            map((id: number) => {
              this.vehicleRoute.id = id;
              return new fromActions.AddVehicleRouteSuccess(this.vehicleRoute);
            })
          );
      })
    );

  @Effect({ dispatch: false })
  addVehicleRouteSuccessEffect$ = this.actions$.ofType(fromActions.ADD_VEHICLE_ROUTE_SUCCESS)
    .pipe(
      map((action: fromActions.AddVehicleRouteSuccess) => action.payload),
      switchMap((vehicleRoute: VehicleRoute) => {
        return this.vehicleRouteService.addVehicleRoute(vehicleRoute)
          .pipe(
            catchError(error => of(new fromActions.AddVehicleRouteFail(error)))
          );
      })
    );

  @Effect()
  loadVehiclesRoutesEffect$ = this.actions$
    .ofType(fromActions.LOAD_VEHICLE_ROUTES)
    .pipe(
      switchMap(() => {
        return this.vehicleRouteService
          .loadVehicleRoutes()
          .pipe(
            map((vehicleRoutes: VehicleRoute[]) => new fromActions.LoadVehicleRoutesSuccess(vehicleRoutes)),
            catchError(error => of(new fromActions.LoadVehicleRoutesFail(error)))
          );
      })
    );
}
