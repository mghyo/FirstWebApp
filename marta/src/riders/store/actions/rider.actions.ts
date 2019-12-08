import { Action } from '@ngrx/store';

import { Rider } from '../../../models';

export const ADD_RIDER = '[Riders] Add rider';
export const ADD_RIDER_FAIL = '[Riders] Add rider fail';
export const ADD_RIDER_SUCCESS = '[Riders] Add rider success';

export class AddRider implements Action {
    readonly type = ADD_RIDER;
    constructor(public payload: Rider) {}
}

export class AddRiderFail implements Action {
    readonly type = ADD_RIDER_FAIL;
    constructor(public payload: Error) {}
}

export class AddRiderSuccess implements Action {
    readonly type = ADD_RIDER_SUCCESS;
    constructor(public payload: Rider) {}
}

export type RidersActions =
    | AddRider
    | AddRiderFail
    | AddRiderSuccess;
