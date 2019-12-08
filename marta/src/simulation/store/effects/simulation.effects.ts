import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { map, switchMap, catchError, debounceTime, throttleTime, withLatestFrom } from 'rxjs/operators';

import * as fromSimulationActions from '../actions';
import * as fromSimulationSelectors from '../selectors';
import * as fromStopActions from '../../../stops/store/actions';
import * as fromVehicleActions from '../../../vehicles/store/actions';
import * as fromServices from '../../services';
import * as fromRoot from '../../../app/app.module';
import { RunType } from '../reducers';

@Injectable()
export class SimulationEffects {
    private stepDurationMinutes: number;
    private runType: RunType;
    private steps: number;

    constructor(
        private actions$: Actions,
        private simulationService: fromServices.SimulationService,
        private store: Store<fromRoot.ApplicationState>,
        private simulationStoreService: fromServices.SimulationStoreService
    ) {
        this.simulationStoreService.getRunType$().subscribe((runType: RunType) => this.runType = runType);
    }

    @Effect()
    loadDatetimeEffect$ = this.actions$.ofType(fromSimulationActions.LOAD_DATETIME)
        .pipe(
            switchMap(() => {
                return this.simulationService.loadDatetime()
                    .pipe(
                        switchMap((datetime: Date) => of(new fromSimulationActions.LoadDatetimeSuccess(datetime))),
                        catchError(error => of(new fromSimulationActions.LoadDatetimeFail(error)))
                    );
            })
        );

    @Effect()
    updateDatetimeEffect$ = this.actions$.ofType(fromSimulationActions.UPDATE_DATETIME)
        .pipe(
            map((action: fromSimulationActions.UpdateDatetime) => action.payload),
            switchMap((datetime: Date) => {
                return this.simulationService.updateDatetime(datetime)
                    .pipe(
                        switchMap(() => of(new fromSimulationActions.UpdateDatetimeSuccess())),
                        catchError(error => of(new fromSimulationActions.UpdateDatetimeFail(error)))
                    );
            })
        );

    @Effect()
    stepEffect$ = this.actions$.ofType(fromSimulationActions.STEP)
        .pipe(
            map((action: fromSimulationActions.Step) => action.payload),
            switchMap((stepDurationMinutes: number) => {
                return this.simulationService.step(stepDurationMinutes)
                    .pipe(
                        switchMap(() => {
                            return [
                                new fromSimulationActions.StepSuccess(),
                                new fromStopActions.LoadStops(),
                                new fromVehicleActions.LoadVehicles()
                            ];
                        }),
                        catchError(error => of(new fromSimulationActions.StepFail(error)))
                    );
            })
        );

    @Effect()
    playContinuousEffect$ = this.actions$.ofType(fromSimulationActions.PLAY_CONTINUOUS)
        .pipe(
            map((action: fromSimulationActions.PlayContinuous) => action.payload),
            switchMap((stepDurationMinutes: number) => {
                this.stepDurationMinutes = stepDurationMinutes;
                return this.simulationService.step(stepDurationMinutes)
                    .pipe(
                        switchMap(() => {
                            let actions: any;
                            if (this.runType === RunType.CONTINUOUS) {
                                actions = [
                                    new fromStopActions.LoadStops(),
                                    new fromVehicleActions.LoadVehicles(),
                                    new fromSimulationActions.StepSuccess(),
                                    new fromSimulationActions.PlayContinuous(this.stepDurationMinutes)
                                ];
                            } else {
                                actions = [new fromSimulationActions.PauseSuccess()];
                            }

                            return actions;
                        })
                    );
            })
        );

    @Effect()
    playIntervalEffect$ = this.actions$.ofType(fromSimulationActions.PLAY_INTERVAL)
        .pipe(
            map((action: fromSimulationActions.PlayInterval) => action.payload),
            switchMap((payload: {steps: number, stepDurationMinutes: number}) => {
                this.stepDurationMinutes = payload.stepDurationMinutes;
                this.steps = payload.steps;

                if (this.steps > 0) {
                    return this.simulationService.step(this.stepDurationMinutes)
                        .pipe(
                            switchMap(() => {
                                let actions: any;
                                if (this.runType === RunType.INTERVAL) {
                                    actions = [
                                        new fromStopActions.LoadStops(),
                                        new fromVehicleActions.LoadVehicles(),
                                        new fromSimulationActions.StepSuccess(),
                                        new fromSimulationActions.PlayInterval({
                                            steps: --this.steps,
                                            stepDurationMinutes: this.stepDurationMinutes
                                        })
                                    ];
                                } else {
                                    actions = [new fromSimulationActions.PauseSuccess()];
                                }

                                return actions;
                            })
                        );
                } else {
                    return of(new fromSimulationActions.PlayIntervalFinished());
                }
            })
        );
}
