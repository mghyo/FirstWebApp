import * as fromActions from '../actions';
import * as moment from 'moment';

export enum RunType {
    PAUSE = 1,
    STEP,
    INTERVAL,
    CONTINUOUS
}

export interface SimulationState {
    dateTime: Date;
    stepping: boolean;
    running: boolean;
    runType: RunType;
    steps: number;
    stepDurationMinutes: number;
}

export const initialSimulationState: SimulationState = {
    dateTime: new Date(),
    stepping: false,
    running: false,
    runType: RunType.PAUSE,
    steps: 5,
    stepDurationMinutes: 5
};

export function reducer(
    state = initialSimulationState,
    action: fromActions.SimulationActions
): SimulationState {
    switch (action.type) {
        case fromActions.LOAD_DATETIME_SUCCESS:
        case fromActions.UPDATE_DATETIME: {
            const newDateTime = action.payload;
            return {
                ...state,
                dateTime: newDateTime
            };
        }

        case fromActions.STEP: {
            const stepDurationMinutes = action.payload;
            return {
                ...state,
                stepping: true,
                stepDurationMinutes
            };
        }

        case fromActions.STEP_FAIL: {
            return {
                ...state,
                stepping: false
            };
        }

        case fromActions.STEP_SUCCESS: {
            const steps = state.steps - (state.runType === RunType.INTERVAL ? 1 : 0);
            const newDateTime = moment(state.dateTime).add(state.stepDurationMinutes, 'minutes').toDate();
            return {
                ...state,
                dateTime: newDateTime,
                stepping: false,
                steps: steps
            };
        }

        case fromActions.PLAY_CONTINUOUS: {
            const stepDurationMinutes = action.payload;
            return {
                ...state,
                stepDurationMinutes,
                running: true,
                runType: RunType.CONTINUOUS
            };
        }

        case fromActions.PLAY_INTERVAL: {
            const stepDurationMinutes = action.payload.stepDurationMinutes;
            const steps = action.payload.steps;
            return {
                ...state,
                steps,
                stepDurationMinutes,
                running: true,
                runType: RunType.INTERVAL
            };
        }

        case fromActions.PAUSE: {
            return {
                ...state,
                runType: RunType.PAUSE
            };
        }

        case fromActions.PAUSE_SUCCESS: {
            return {
                ...state,
                running: false
            };
        }

        case fromActions.PLAY_INTERVAL_FINISHED: {
            return {
                ...state,
                running: false,
                runType: RunType.PAUSE
            };
        }

        default: {
            return state;
        }
    }
}

export const getSimulationStateDateTime = (state: SimulationState) => state.dateTime;
export const getSimulationStateRunning = (state: SimulationState) => state.running;
export const getSimulationStateStepping = (state: SimulationState) => state.stepping;
export const getSimulationStateRunType = (state: SimulationState) => state.runType;
export const getSimulationStateSteps = (state: SimulationState) => state.steps;
export const getSimulationStateStepDurationMins = (state: SimulationState) => state.stepDurationMinutes;
