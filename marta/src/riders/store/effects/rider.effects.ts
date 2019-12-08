import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as fromActions from '../actions';
import * as fromServices from '../../services';

import { Rider } from '../../../models';

@Injectable()
export class RidersEffects {
    private rider: Rider;

    constructor(
        private actions$: Actions,
        private riderService: fromServices.RiderService
    ) {}

    @Effect()
    addRiderEffect$ = this.actions$.ofType(fromActions.ADD_RIDER)
        .pipe(
            map((action: fromActions.AddRider) => action.payload),
            switchMap((rider: Rider) => {
                this.rider = rider;
                return this.riderService.getNewRiderId()
                    .pipe(
                        map((id: number) => {
                            this.rider.id = id;
                            return new fromActions.AddRiderSuccess(this.rider);
                        })
                    );
            })
        );

    @Effect({ dispatch: false })
    addRiderSuccessEffect$ = this.actions$.ofType(fromActions.ADD_RIDER_SUCCESS)
        .pipe(
            map((action: fromActions.AddRiderSuccess) => action.payload),
            switchMap((rider: Rider) => {
                return this.riderService.addRider(this.rider)
                    .pipe(
                        catchError(error => of(new fromActions.AddRiderFail(error)))
                    );
            })
        );
}
