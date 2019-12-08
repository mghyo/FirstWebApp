import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromReducer from '../reducers';

import { Vehicle, VehicleType } from '../../../models';

export const getVehicleFeature = createFeatureSelector<fromReducer.VehicleState>(
    'vehicleReducer'
);

export const getVehicleState = createSelector(
    getVehicleFeature,
    (state: fromReducer.VehicleState) => state
);

export const getVehicleEntities = createSelector(
    getVehicleState,
    fromReducer.getVehicleStateEntities
);

export const getVehicles = createSelector(
    getVehicleEntities,
    (entities: { [id: number]: Vehicle }) => {
        return Object.keys(entities).map((key: string) => entities[parseInt(key, 10)]);
    }
);

export const getTrains = createSelector(
    getVehicles,
    (vehicles: Vehicle[]) => vehicles.filter((vehicle: Vehicle) => vehicle.type === VehicleType.TRAIN)
);

export const getBuses = createSelector(
    getVehicles,
    (vehicles: Vehicle[]) => vehicles.filter((vehicle: Vehicle) => vehicle.type === VehicleType.BUS)
);

export const getTrainsAtStops = createSelector(
    getTrains,
    (trains: Vehicle[]) => trains.filter((train: Vehicle) => train.atStop)
);

export const getBusesAtStops = createSelector(
    getBuses,
    (buses: Vehicle[]) => buses.filter((bus: Vehicle) => bus.atStop)
);
