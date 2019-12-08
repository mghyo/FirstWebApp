import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromReducer from '../reducers';

export const getSimulationFeature = createFeatureSelector<fromReducer.SimulationState>(
    'simulationReducer'
);

export const getSimulationState = createSelector(
    getSimulationFeature,
    (state: fromReducer.SimulationState) => state
);

export const getSimulationDateTime = createSelector(
    getSimulationState,
    fromReducer.getSimulationStateDateTime
);

export const getSimulationRunning = createSelector(
    getSimulationState,
    fromReducer.getSimulationStateRunning
);

export const getSimulationStepping = createSelector(
    getSimulationState,
    fromReducer.getSimulationStateStepping
);

export const getSimulationRunType = createSelector(
    getSimulationState,
    fromReducer.getSimulationStateRunType
);

export const getSimulationSteps = createSelector(
    getSimulationState,
    fromReducer.getSimulationStateSteps
);

export const getSimulationStepDurationMins = createSelector(
    getSimulationState,
    fromReducer.getSimulationStateStepDurationMins
);
