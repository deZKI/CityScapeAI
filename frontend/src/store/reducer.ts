import {SET_LOADING, SetLoadingAction} from "./loading/loadingActions";
import {TLoadingState, loadingReducer} from "./loading/loadingReducer";
import {activeAvailabilityReducer, TActiveAvailabilityState} from "./activeAvailability/activeAvailabilityReducer";
import {EAvailability} from "../types/enums/EAvailability.enum";
import {SET_ACTIVE_AVAILABILITY, SetActiveAvailabilityAction} from "./activeAvailability/activeAvailabilityActions";

export type TInitialState = {
  activeAvailability: TActiveAvailabilityState;
  loading: TLoadingState;
}

export const initialState: TInitialState = {
  activeAvailability: {
    activeAvailability: EAvailability.all
  },
  loading: {
    loading: false
  },
}

type Actions = SetActiveAvailabilityAction | SetLoadingAction

export const rootReducer = (state = initialState, action: Actions): TInitialState => {
  switch (action.type) {
    case SET_ACTIVE_AVAILABILITY:
      return {
        ...state,
        activeAvailability: activeAvailabilityReducer(state.activeAvailability, action)
      }
    case SET_LOADING:
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    default:
      return state;
  }
}