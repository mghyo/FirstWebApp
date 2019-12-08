import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../../app/app.module';
import * as fromActions from '../store/actions';
import * as fromSelectors from '../store/selectors';

import { Vehicle } from '../../models';

@Injectable()
export class VehicleStoreService {
    constructor(private store: Store<fromRoot.ApplicationState>) {}

    public addVehicle(vehicle: Vehicle): void {
        this.store.dispatch(new fromActions.AddVehicle(vehicle));
    }

    public loadVehicles(): void {
        this.store.dispatch(new fromActions.LoadVehicles());
    }

    public getVehicles$(): Observable<Vehicle[]> {
        return this.store.select(fromSelectors.getVehicles);
    }

    public getBuses$(): Observable<Vehicle[]> {
        return this.store.select(fromSelectors.getBuses);
    }

    public getTrains$(): Observable<Vehicle[]> {
        return this.store.select(fromSelectors.getTrains);
    }
}
