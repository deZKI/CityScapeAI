import {SET_ACTIVE_AVAILABILITY, SetActiveAvailabilityAction} from "./activeAvailability/activeAvailabilityActions";
import {activeAvailabilityReducer, TActiveAvailabilityState} from "./activeAvailability/activeAvailabilityReducer";
import {modeSwitcherReducer, TModeSwitcherState} from "./modeSwitcher/modeSwitcherReducer";
import {SET_LOADING, SetLoadingAction} from "./loading/loadingActions";
import {TLoadingState, loadingReducer} from "./loading/loadingReducer";
import {SET_MODE_SWITCHER, SetModeSwitcherAction} from "./modeSwitcher/modeSwitcherActions";
import {EAvailability} from "../types/enums/EAvailability.enum";
import {EModeSwitcher} from "../types/enums/EModeSwitcher.enum";

export type TInitialState = {
  activeAvailability: TActiveAvailabilityState;
  modeSwitcher: TModeSwitcherState;
  loading: TLoadingState;
}

export const initialState: TInitialState = {
  activeAvailability: {
    activeAvailability: EAvailability.all
  },
  modeSwitcher: {
    modeSwitcher: EModeSwitcher.polygons
  },
  loading: {
    loading: false
  },
}

type Actions = SetActiveAvailabilityAction
  | SetModeSwitcherAction
  | SetLoadingAction

export const rootReducer = (state = initialState, action: Actions): TInitialState => {
  switch (action.type) {
    case SET_ACTIVE_AVAILABILITY:
      return {
        ...state,
        activeAvailability: activeAvailabilityReducer(state.activeAvailability, action)
      }
    case SET_MODE_SWITCHER:
      return {
        ...state,
        modeSwitcher: modeSwitcherReducer(state.modeSwitcher, action)
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