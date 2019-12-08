import * as fromActions from '../actions';

import { VehicleRoute } from '../../../models';

export interface VehicleRouteState {
  entities: { [id: number]: VehicleRoute };
}

export const initialVehicleRouteState: VehicleRouteState = {
  entities: {}
};

export function reducer(
  state = initialVehicleRouteState,
  action: fromActions.VehicleRoutesActions
): VehicleRouteState {
  switch (action.type) {
    case fromActions.ADD_VEHICLE_ROUTE_SUCCESS: {
      const vehicleRoute = action.payload;
      const entities = {
        ...state.entities,
        [vehicleRoute.id]: vehicleRoute
      };
      return {
        ...state,
        entities
      };
    }
    case fromActions.LOAD_VEHICLES_ROUTES_SUCCESS: {
      const vehicleRoutes = action.payload;
      const newEntities = vehicleRoutes.reduce(
        (entities: { [id: number]: VehicleRoute }, vehicleRoute: VehicleRoute) => {
          return {
            ...entities,
            [vehicleRoute.id]: vehicleRoute
          };
        },
        { ...state.entities }
      );

      return {
        ...state,
        entities: newEntities
      };
    }
    default: {
      return state;
    }
  }
}

export const getVehicleRouteStateEntities = (state: VehicleRouteState) => {
  return state && state.entities ? state.entities : {};
};
