import { Action } from '@ngrx/store';

export const LOAD_DATETIME = '[Simulation] Load datetime';
export const LOAD_DATETIME_FAIL = '[Simulation] Load datetime fail';
export const LOAD_DATETIME_SUCCESS = '[Simulation] Load datetime success';

export class LoadDatetime implements Action {
    readonly type = LOAD_DATETIME;
}

export class LoadDatetimeFail implements Action {
    readonly type = LOAD_DATETIME_FAIL;
    constructor(public payload: any) {}
}

export class LoadDatetimeSuccess implements Action {
    readonly type = LOAD_DATETIME_SUCCESS;
    constructor(public payload: Date) {}
}

export const UPDATE_DATETIME = '[Simulation] Update datetime';
export const UPDATE_DATETIME_FAIL = '[Simulation] Update datetime fail';
export const UPDATE_DATETIME_SUCCESS = '[Simulation] Update datetime success';

export class UpdateDatetime implements Action {
    readonly type = UPDATE_DATETIME;
    constructor(public payload: Date) {}
}

export class UpdateDatetimeFail implements Action {
    readonly type = UPDATE_DATETIME_FAIL;
    constructor(public payload: any) {}
}

export class UpdateDatetimeSuccess implements Action {
    readonly type = UPDATE_DATETIME_SUCCESS;
}

export const STEP = '[Simulation] Step';
export const STEP_FAIL = '[Simulation] Step fail';
export const STEP_SUCCESS = '[Simulation] Step success';

export class Step implements Action {
    readonly type = STEP;
    constructor(public payload: number) {}
}

export class StepFail implements Action {
    readonly type = STEP_FAIL;
    constructor(public payload: any) {}
}

export class StepSuccess implements Action {
    readonly type = STEP_SUCCESS;
}

export const PLAY_CONTINUOUS = '[Simulation] Play continuous';
export const PLAY_INTERVAL = '[Simulation] Play interval';
export const PLAY_INTERVAL_FINISHED = '[Simulation] Play interval finished';

export class PlayContinuous implements Action {
    readonly type = PLAY_CONTINUOUS;
    constructor(public payload: number) {}
}

export class PlayInterval implements Action {
    readonly type = PLAY_INTERVAL;
    constructor(public payload: {steps: number, stepDurationMinutes: number}) {}
}

export class PlayIntervalFinished implements Action {
    readonly type = PLAY_INTERVAL_FINISHED;
}

export const PAUSE = '[Simulation] Pause';
export const PAUSE_SUCCESS = '[Simulation] Pause success';

export class Pause implements Action {
    readonly type = PAUSE;
}

export class PauseSuccess implements Action {
    readonly type = PAUSE_SUCCESS;
}

export type SimulationActions =
    | LoadDatetime
    | LoadDatetimeFail
    | LoadDatetimeSuccess
    | UpdateDatetime
    | UpdateDatetimeFail
    | UpdateDatetimeSuccess
    | Step
    | StepFail
    | StepSuccess
    | PlayContinuous
    | PlayInterval
    | PlayIntervalFinished
    | Pause
    | PauseSuccess;
