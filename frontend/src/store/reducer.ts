import {SET_ACTIVE_AVAILABILITY, SetActiveAvailabilityAction} from "./activeAvailability/activeAvailabilityActions";
import {SET_MARKERS_COORDINATES, SetMarkersCoordinatesAction} from "./markersCoordinates/markersCoordinatesActions";
import {activeAvailabilityReducer, TActiveAvailabilityState} from "./activeAvailability/activeAvailabilityReducer";
import {markersCoordinatesReducer, TMarkersCoordinatesState} from "./markersCoordinates/markersCoordinatesReducer";
import {SET_HEATMAP_LOADING, SetHeatmapLoadingAction} from "./heatmapLoading/heatmapLoadingActions";
import {heatmapLoadingReducer, THeatmapLoadingState} from "./heatmapLoading/heatmapLoadingReducer";
import {SET_MARK_SWITCHER, SetMarkSwitcherAction} from "./markSwitcher/markSwitcherActions";
import {SET_MODE_SWITCHER, SetModeSwitcherAction} from "./modeSwitcher/modeSwitcherActions";
import {SET_POLYGONS_DATA, SetPolygonsDataAction} from "./polygonsData/polygonsDataActions";
import {polygonsDataReducer, TPolygonsDataState} from "./polygonsData/polygonsDataReducer";
import {modeSwitcherReducer, TModeSwitcherState} from "./modeSwitcher/modeSwitcherReducer";
import {markSwitcherReducer, TMarkSwitcherState} from "./markSwitcher/markSwitcherReducer";
import {SET_HEATMAP_DATA, SetHeatmapDataAction} from "./heatmapData/headmapDataActions";
import {heatmapDataReducer, THeatmapDataState} from "./heatmapData/heatmapDataReducer";
import {SET_LOADING, SetLoadingAction} from "./loading/loadingActions";
import {loadingReducer, TLoadingState} from "./loading/loadingReducer";
import {EAvailability} from "../types/enums/EAvailability.enum";
import {EModeSwitcher} from "../types/enums/EModeSwitcher.enum";

export type TInitialState = {
  activeAvailability: TActiveAvailabilityState;
  markersCoordinates: TMarkersCoordinatesState;
  heatmapLoading: THeatmapLoadingState;
  modeSwitcher: TModeSwitcherState;
  markSwitcher: TMarkSwitcherState;
  polygonsData: TPolygonsDataState;
  heatmapData: THeatmapDataState;
  loading: TLoadingState;
}

export const initialState: TInitialState = {
  activeAvailability: {
    activeAvailability: EAvailability.all
  },
  markersCoordinates: {
    markersCoordinates: []
  },
  heatmapLoading: {
    heatmapLoading: false
  },
  modeSwitcher: {
    modeSwitcher: EModeSwitcher.polygons
  },
  markSwitcher: {
    markSwitcher: false
  },
  polygonsData: {
    polygonsData: []
  },
  heatmapData: {
    heatmapData: []
  },
  loading: {
    loading: false
  },
}

type Actions = SetActiveAvailabilityAction
  | SetMarkersCoordinatesAction
  | SetHeatmapLoadingAction
  | SetModeSwitcherAction
  | SetMarkSwitcherAction
  | SetPolygonsDataAction
  | SetHeatmapDataAction
  | SetLoadingAction

export const rootReducer = (state = initialState, action: Actions): TInitialState => {
  switch (action.type) {
    case SET_ACTIVE_AVAILABILITY:
      return {
        ...state,
        activeAvailability: activeAvailabilityReducer(state.activeAvailability, action)
      }
    case SET_MARKERS_COORDINATES:
      return {
        ...state,
        markersCoordinates: markersCoordinatesReducer(state.markersCoordinates, action)
      }
    case SET_HEATMAP_LOADING:
      return {
        ...state,
        heatmapLoading: heatmapLoadingReducer(state.heatmapLoading, action)
      }
    case SET_MODE_SWITCHER:
      return {
        ...state,
        modeSwitcher: modeSwitcherReducer(state.modeSwitcher, action)
      }
    case SET_MARK_SWITCHER:
      return {
        ...state,
        markSwitcher: markSwitcherReducer(state.markSwitcher, action)
      }
    case SET_POLYGONS_DATA:
      return {
        ...state,
        polygonsData: polygonsDataReducer(state.polygonsData, action)
      }
    case SET_HEATMAP_DATA:
      return {
        ...state,
        heatmapData: heatmapDataReducer(state.heatmapData, action)
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