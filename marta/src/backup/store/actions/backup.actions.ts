import { Action } from '@ngrx/store';

export const LOAD_DATA = '[Backup] Load data';
export const LOAD_DATA_FAIL = '[Backup] Load data fail';

export class LoadData implements Action {
    readonly type = LOAD_DATA;
    constructor(public payload: {tableName: string, fileName: string}) {}
}

export class LoadDataFail implements Action {
    readonly type = LOAD_DATA_FAIL;
    constructor(public payload: any) {}
}

export const SAVE_DATA = '[Backup] Save data';
export const SAVE_DATA_FAIL = '[Backup] Save data fail';

export class SaveData implements Action {
    readonly type = SAVE_DATA;
    constructor(public payload: {tableName: string, fileName: string}) {}
}

export class SaveDataFail implements Action {
    readonly type = SAVE_DATA_FAIL;
    constructor(public payload: any) {}
}

export const RESET = '[Backup] Reset';
export const RESET_FAIL = '[Backup] Reset fail';

export class ResetSimulation implements Action {
    readonly type = RESET;
}

export class ResetSimulationFail implements Action {
    readonly type = RESET_FAIL;
    constructor(public payload: any) {}
}

export type BackupActions =
    | LoadData
    | LoadDataFail
    | SaveData
    | SaveDataFail
    | ResetSimulation
    | ResetSimulationFail;
