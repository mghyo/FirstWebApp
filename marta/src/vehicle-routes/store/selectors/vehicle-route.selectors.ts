import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromReducer from '../reducers';

import { VehicleRoute, VehicleType } from '../../../models';

export const getVehicleRouteFeature = createFeatureSelector<fromReducer.VehicleRouteState>(
  'vehicleRouteReducer'
);

export const getVehicleRouteState = createSelector(
  getVehicleRouteFeature,
  (state: fromReducer.VehicleRouteState) => state
);

export const getVehicleRouteEntities = createSelector(
  getVehicleRouteState,
  fromReducer.getVehicleRouteStateEntities
);

export const getVehicleRoutes = createSelector(
  getVehicleRouteEntities,
  (entities: { [id: number]: VehicleRoute }) => {
    return Object.keys(entities).map(
      (key: string) => entities[parseInt(key, 10)]
    );
  }
);

export const getTrainRoutes = createSelector(
  getVehicleRoutes,
  (vehicleRoutes: VehicleRoute[]) =>
    vehicleRoutes.filter(
      (vehicleRoute: VehicleRoute) => vehicleRoute.type === VehicleType.TRAIN
    )
);

export const getBusRoutes = createSelector(
  getVehicleRoutes,
  (vehicleRoutes: VehicleRoute[]) =>
    vehicleRoutes.filter(
      (vehicleRoute: VehicleRoute) => vehicleRoute.type === VehicleType.BUS
    )
);

// TODO return stop id list
export const getStopsAtRoute = createSelector(
  getVehicleRoutes,
  (vehicleRoutes: VehicleRoute[]) =>
    vehicleRoutes.filter(
      (vehicleRoute: VehicleRoute) => vehicleRoute.type === VehicleType.BUS
    )
);
