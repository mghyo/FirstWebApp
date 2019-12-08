import { Action } from '@ngrx/store';

import { VehicleRoute } from '../../../models';

export const ADD_VEHICLE_ROUTE = '[Vehicle Routes] Add vehicle route';
export const ADD_VEHICLE_ROUTE_FAIL = '[Vehicle Routes] Add vehicle route fail';
export const ADD_VEHICLE_ROUTE_SUCCESS = '[Vehicle Routes] Add vehicle route success';

export class AddVehicleRoute implements Action {
  readonly type = ADD_VEHICLE_ROUTE;
  constructor(public payload: VehicleRoute) {}
}

export class AddVehicleRouteFail implements Action {
  readonly type = ADD_VEHICLE_ROUTE_FAIL;
  constructor(public payload: any) {}
}

export class AddVehicleRouteSuccess implements Action {
  readonly type = ADD_VEHICLE_ROUTE_SUCCESS;
  constructor(public payload: VehicleRoute) {}
}

export const LOAD_VEHICLE_ROUTES = '[Vehicle Routes] Load vehicle routes';
export const LOAD_VEHICLES_ROUTES_FAIL = '[Vehicle Routes] Load vehicle routes fail';
export const LOAD_VEHICLES_ROUTES_SUCCESS = '[Vehicle Routes] Load vehicle routes success';

export class LoadVehicleRoutes implements Action {
  readonly type = LOAD_VEHICLE_ROUTES;
}

export class LoadVehicleRoutesFail implements Action {
  readonly type = LOAD_VEHICLES_ROUTES_FAIL;
  constructor(public payload: any) {}
}

export class LoadVehicleRoutesSuccess implements Action {
  readonly type = LOAD_VEHICLES_ROUTES_SUCCESS;
  constructor(public payload: VehicleRoute[]) {}
}

export type VehicleRoutesActions =
  | AddVehicleRoute
  | AddVehicleRouteFail
  | AddVehicleRouteSuccess
  | LoadVehicleRoutes
  | LoadVehicleRoutesFail
  | LoadVehicleRoutesSuccess;
