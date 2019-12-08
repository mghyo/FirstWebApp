import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/operators';

import * as fromRoot from '../../app/app.module';
import * as fromActions from '../store/actions';
import * as fromSelectors from '../store/selectors';

import { Stop } from '../../models';
import { RunType } from '..';

@Injectable()
export class SimulationStoreService {
    constructor(private store: Store<fromRoot.ApplicationState>) {}

    public loadDatetime(): void {
        this.store.dispatch(new fromActions.LoadDatetime());
    }

    public updateDatetime(date: Date): void {
        this.store.dispatch(new fromActions.UpdateDatetime(date));
    }

    public step(duration: number): void {
        this.store.dispatch(new fromActions.Step(duration));
    }

    public playInterval(stepDurationMinutes: number, steps: number) {
        this.store.dispatch(new fromActions.PlayInterval({stepDurationMinutes, steps}));
    }

    public playContinuous(stepDurationMinutes: number) {
        this.store.dispatch(new fromActions.PlayContinuous(stepDurationMinutes));
    }

    public pause() {
        this.store.dispatch(new fromActions.Pause());
    }

    public getRunType$(): Observable<RunType> {
        return this.store.select(fromSelectors.getSimulationRunType);
    }

    public getSteps$(): Observable<number> {
        return this.store.select(fromSelectors.getSimulationSteps);
    }

    public getDateTime$(): Observable<Date> {
        return this.store.select(fromSelectors.getSimulationDateTime);
    }

    public getRunning$(): Observable<boolean> {
        return this.store.select(fromSelectors.getSimulationRunning);
    }

    public getStepping$(): Observable<boolean> {
        return this.store.select(fromSelectors.getSimulationStepping);
    }

    public getDisabled$(): Observable<boolean> {
        return this.getRunning$().pipe(
            combineLatest(this.getStepping$(), (running: boolean, stepping: boolean) => {
                return running || stepping;
            })
        );
    }
}
