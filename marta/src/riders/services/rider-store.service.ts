import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import * as fromRoot from '../../app/app.module';
import * as fromActions from '../store/actions';

import { Rider } from '../../models';

@Injectable()
export class RiderStoreService {
    constructor(private store: Store<fromRoot.ApplicationState>) {}

    public addRider(rider: Rider): void {
        this.store.dispatch(new fromActions.AddRider(rider));
    }
}
