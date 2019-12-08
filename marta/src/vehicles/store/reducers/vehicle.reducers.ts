import * as fromActions from '../actions';

import { Vehicle } from '../../../models';

export interface VehicleState {
    entities: { [id: number]: Vehicle};
}

export const initialVehicleState: VehicleState = {
    entities: {}
};

export function reducer(
    state = initialVehicleState,
    action: fromActions.VehiclesActions
): VehicleState {
    switch (action.type) {
        case fromActions.ADD_VEHICLE_SUCCESS: {
            const vehicle = action.payload;
            return {
                entities: {
                    ...state.entities,
                    [vehicle.id]: vehicle
                }
            };
        }
        case fromActions.LOAD_VEHICLES_SUCCESS: {
            const vehicles = action.payload;
            const newEntities = vehicles.reduce((entities: {[id: number]: Vehicle}, vehicle: Vehicle) => {
                return {
                    ...entities,
                    [vehicle.id]: vehicle
                };
            }, { ...state.entities });

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

export const getVehicleStateEntities = (state: VehicleState) => {
    return state && state.entities ? state.entities : {};
};
