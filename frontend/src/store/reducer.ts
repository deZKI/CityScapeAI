import {SET_MODE_SWITCHER, SetModeSwitcherAction} from "./modeSwitcher/modeSwitcherActions";
import {TModeSwitcherState, modeSwitcherReducer} from "./modeSwitcher/modeSwitcherReducer";
import {SET_MAX_DOTS_DATA, SetMaxDotsDataAction} from "./maxDotsData/maxDotsDataActions";
import {TMaxDotsDataState, maxDotsDataReducer} from "./maxDotsData/maxDotsDataReducer";
import {SET_CSV_DATA, SetCSVDataAction} from "./csvData/csvDataActions";
import {TCSVDataState, csvDataReducer} from "./csvData/csvDataReducer";
import {SET_LOADING, SetLoadingAction} from "./loading/loadingActions";
import {TLoadingState, loadingReducer} from "./loading/loadingReducer";

export type TInitialState = {
  modeSwitcher: TModeSwitcherState;
  maxDotsData: TMaxDotsDataState;
  loading: TLoadingState;
  csvData: TCSVDataState;
}

export const initialState: TInitialState = {
  modeSwitcher: {
    modeSwitcher: "banners"
  },
  maxDotsData: {
    maxDotsData: {}
  },
  loading: {
    loading: false
  },
  csvData: {
    csvData: {}
  },
}

type Actions = SetModeSwitcherAction
  | SetMaxDotsDataAction
  | SetLoadingAction
  | SetCSVDataAction

export const rootReducer = (state = initialState, action: Actions): TInitialState => {
  switch (action.type) {
    case SET_MODE_SWITCHER:
      return {
        ...state,
        modeSwitcher: modeSwitcherReducer(state.modeSwitcher, action)
      }
    case SET_MAX_DOTS_DATA:
      return {
        ...state,
        maxDotsData: maxDotsDataReducer(state.maxDotsData, action)
      }
    case SET_LOADING:
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    case SET_CSV_DATA:
      return {
        ...state,
        csvData: csvDataReducer(state.csvData, action)
      }
    default:
      return state;
  }
}
