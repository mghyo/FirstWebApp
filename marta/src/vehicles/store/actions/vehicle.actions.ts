import { Action } from '@ngrx/store';

import { Vehicle } from '../../../models';

export const ADD_VEHICLE = '[Vehicles] Add vehicle';
export const ADD_VEHICLE_FAIL = '[Vehicles] Add vehicle fail';
export const ADD_VEHICLE_SUCCESS = '[Vehicles] Add vehicle success';

export class AddVehicle implements Action {
    readonly type = ADD_VEHICLE;
    constructor(public payload: Vehicle) {}
}

export class AddVehicleFail implements Action {
    readonly type = ADD_VEHICLE_FAIL;
    constructor(public payload: Error) {}
}

export class AddVehicleSuccess implements Action {
    readonly type = ADD_VEHICLE_SUCCESS;
    constructor(public payload: Vehicle) {}
}

export const LOAD_VEHICLES = '[Vehicles] Load vehicles';
export const LOAD_VEHICLES_FAIL = '[Vehicles] Load vehicles fail';
export const LOAD_VEHICLES_SUCCESS = '[Vehicles] Load vehicles success';

export class LoadVehicles implements Action {
    readonly type = LOAD_VEHICLES;
}

export class LoadVehiclesFail implements Action {
    readonly type = LOAD_VEHICLES_FAIL;
    constructor(public payload: Error) {}
}

export class LoadVehiclesSuccess implements Action {
    readonly type = LOAD_VEHICLES_SUCCESS;
    constructor(public payload: Vehicle[]) {}
}

export type VehiclesActions =
    | AddVehicle
    | AddVehicleFail
    | AddVehicleSuccess
    | LoadVehicles
    | LoadVehiclesFail
    | LoadVehiclesSuccess;
