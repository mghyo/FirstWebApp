import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromRoot from '../../app/app.module';
import * as fromActions from '../store/actions';

import { Stop } from '../../models';
import { merge, combineLatest } from 'rxjs/operators';

@Injectable()
export class BackupStoreService {
    constructor(private store: Store<fromRoot.ApplicationState>) {}

    public loadData(tableName: string, fileName: string): void {
        this.store.dispatch(new fromActions.LoadData({tableName, fileName}));
    }

    public saveData(tableName: string, fileName: string): void {
        this.store.dispatch(new fromActions.SaveData({tableName, fileName}));
    }

    public resetSimulation(): void {
        this.store.dispatch(new fromActions.ResetSimulation());
    }
}
