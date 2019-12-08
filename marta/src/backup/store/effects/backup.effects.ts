import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as fromActions from '../actions';
import * as fromServices from '../../services';
import * as fromVehicleActions from '../../../vehicles/store/actions';
import * as fromRouteActions from '../../../vehicle-routes/store/actions';
import * as fromStopActions from '../../../stops/store/actions';

@Injectable()
export class BackupEffects {
  constructor(
    private actions$: Actions,
    private backupService: fromServices.BackupService
  ) {}

  @Effect()
  loadDataEffect$ = this.actions$.ofType(fromActions.LOAD_DATA).pipe(
    map((action: fromActions.LoadData) => action.payload),
    switchMap((data: { tableName: string; fileName: string }) => {
      return this.backupService.loadData(data.tableName, data.fileName).pipe(
        switchMap(() => {
          return [
            new fromVehicleActions.LoadVehicles(),
            new fromRouteActions.LoadVehicleRoutes(),
            new fromStopActions.LoadStops()
          ];
        }),
        catchError(error => of(new fromActions.LoadDataFail(error)))
      );
    })
  );

  @Effect({ dispatch: false })
  saveDataEffect$ = this.actions$.ofType(fromActions.SAVE_DATA).pipe(
    map((action: fromActions.SaveData) => action.payload),
    switchMap((data: { tableName: string; fileName: string }) => {
      return this.backupService
        .saveData(data.tableName, data.fileName)
        .pipe(catchError(error => of(new fromActions.SaveDataFail(error))));
    })
  );

  @Effect()
  resetSimulationEffect$ = this.actions$.ofType(fromActions.RESET).pipe(
    switchMap(() => {
      return this.backupService.resetSimulation().pipe(
        switchMap(() => {
          return [
            new fromVehicleActions.LoadVehicles(),
            new fromRouteActions.LoadVehicleRoutes(),
            new fromStopActions.LoadStops()
          ];
        }),
        catchError(error => of(new fromActions.ResetSimulationFail(error)))
      );
    })
  );
}
