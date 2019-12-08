import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromReducer from '../reducers';

import { Stop, VehicleType } from '../../../models';

export const getStopFeature = createFeatureSelector<fromReducer.StopState>(
    'stopReducer'
);

export const getStopState = createSelector(
    getStopFeature,
    (state: fromReducer.StopState) => state
);

export const getStopEntities = createSelector(
    getStopState,
    fromReducer.getStopStateEntities
);

export const getStops = createSelector(
    getStopEntities,
    (entities: { [id: number]: Stop }) => {
        return Object.keys(entities).map((key: string) => entities[parseInt(key, 10)]);
    }
);

export const getBusStops = createSelector(
    getStops,
    (stops: Stop[]) => stops.filter((stop: Stop) => stop.type === VehicleType.BUS)
);

export const getTrainStops = createSelector(
    getStops,
    (stops: Stop[]) => stops.filter((stop: Stop) => stop.type === VehicleType.TRAIN)
);
