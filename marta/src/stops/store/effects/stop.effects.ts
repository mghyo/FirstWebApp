import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as fromActions from '../actions';
import * as fromServices from '../../services';

import { Stop } from '../../../models';

@Injectable()
export class StopsEffects {
    private stop: Stop;

    constructor(
        private actions$: Actions,
        private stopService: fromServices.StopService
    ) {}

    @Effect()
    addStopEffect$ = this.actions$.ofType(fromActions.ADD_STOP)
        .pipe(
            map((action: fromActions.AddStop) => action.payload),
            switchMap((stop: Stop) => {
                this.stop = stop;
                return this.stopService.getNewStopId()
                    .pipe(
                        map((id: number) => {
                            this.stop.id = id;
                            return new fromActions.AddStopSuccess(this.stop);
                        })
                    );
            })
        );

    @Effect({ dispatch: false })
    addStopSuccessEffect$ = this.actions$.ofType(fromActions.ADD_STOP_SUCCESS)
        .pipe(
            map((action: fromActions.AddStopSuccess) => action.payload),
            switchMap((stop: Stop) => {
                return this.stopService.addStop(this.stop)
                    .pipe(
                        catchError(error => of(new fromActions.AddStopFail(error)))
                    );
            })
        );

    @Effect()
    loadStopsEffect$ = this.actions$.ofType(fromActions.LOAD_STOPS)
        .pipe(
            switchMap(() => {
                return this.stopService.loadStops()
                    .pipe(
                        map((stops: Stop[]) => new fromActions.LoadStopsSuccess(stops)),
                        catchError(error => of(new fromActions.LoadStopsFail(error)))
                    );
            })
        );
}