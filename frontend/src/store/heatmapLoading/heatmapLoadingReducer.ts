import {SET_HEATMAP_LOADING, SetHeatmapLoadingAction} from "./heatmapLoadingActions";
import {initialState} from "../reducer";

export type THeatmapLoadingState = {
  heatmapLoading: boolean;
}

type HeatmapLoadingActions = SetHeatmapLoadingAction;

export const heatmapLoadingReducer = (state = initialState.heatmapLoading, action: HeatmapLoadingActions): THeatmapLoadingState => {
  switch (action.type) {
    case SET_HEATMAP_LOADING:
      return {
        ...state,
        heatmapLoading: action.heatmapLoading
      }
    default:
      return state;
  }
}