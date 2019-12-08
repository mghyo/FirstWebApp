import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../../app/app.module';
import * as fromActions from '../store/actions';
import * as fromSelectors from '../store/selectors';

import { Stop } from '../../models';

@Injectable()
export class StopStoreService {
    constructor(private store: Store<fromRoot.ApplicationState>) {}

    public addStop(stop: Stop): void {
        this.store.dispatch(new fromActions.AddStop(stop));
    }

    public loadStops(): void {
        this.store.dispatch(new fromActions.LoadStops());
    }

    public getStops$(): Observable<Stop[]> {
        return this.store.select(fromSelectors.getStops);
    }

    public getStopsEntities$(): Observable<{ [id: number]: Stop }> {
        return this.store.select(fromSelectors.getStopEntities);
    }

    public getBusStops$(): Observable<Stop[]> {
        return this.store.select(fromSelectors.getBusStops);
    }

    public getTrainStops$(): Observable<Stop[]> {
        return this.store.select(fromSelectors.getTrainStops);
    }
}
