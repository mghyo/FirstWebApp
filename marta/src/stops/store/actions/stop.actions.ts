import { Action } from '@ngrx/store';

import { Stop } from '../../../models';

export const ADD_STOP = '[Stops] Add stop';
export const ADD_STOP_FAIL = '[Stops] Add stop fail';
export const ADD_STOP_SUCCESS = '[Stops] Add stop success';

export class AddStop implements Action {
    readonly type = ADD_STOP;
    constructor(public payload: Stop) {}
}

export class AddStopFail implements Action {
    readonly type = ADD_STOP_FAIL;
    constructor(public payload: Error) {}
}

export class AddStopSuccess implements Action {
    readonly type = ADD_STOP_SUCCESS;
    constructor(public payload: Stop) {}
}

export const LOAD_STOPS = '[Stops] Load stops';
export const LOAD_STOPS_FAIL = '[Stops] Load stops fail';
export const LOAD_STOPS_SUCCESS = '[Stops] Load stops success';

export class LoadStops implements Action {
    readonly type = LOAD_STOPS;
}

export class LoadStopsFail implements Action {
    readonly type = LOAD_STOPS_FAIL;
    constructor(public payload: Error) {}
}

export class LoadStopsSuccess implements Action {
    readonly type = LOAD_STOPS_SUCCESS;
    constructor(public payload: Stop[]) {}
}

export type StopsActions =
    | AddStop
    | AddStopFail
    | AddStopSuccess
    | LoadStops
    | LoadStopsFail
    | LoadStopsSuccess;
