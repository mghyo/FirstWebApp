import * as fromActions from '../actions';

import { Stop } from '../../../models';

export interface StopState {
  entities: { [id: number]: Stop };
}

export const initialStopState: StopState = {
  entities: {}
};

export function reducer(
  state = initialStopState,
  action: fromActions.StopsActions
): StopState {
  switch (action.type) {
    case fromActions.ADD_STOP_SUCCESS: {
      const stop = action.payload;
      const entities = {
        ...state.entities,
        [stop.id]: stop
      };
      return {
        ...state,
        entities
      };
    }
    case fromActions.LOAD_STOPS_SUCCESS: {
      const stops = action.payload;
      const newEntities = stops.reduce(
        (entities: { [id: number]: Stop }, stop: Stop) => {
          return {
            ...entities,
            [stop.id]: stop
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

export const getStopStateEntities = (state: StopState) => {
  return state && state.entities ? state.entities : {};
};
