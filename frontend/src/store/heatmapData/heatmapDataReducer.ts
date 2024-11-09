import {initialState} from "../reducer";
import {SET_HEATMAP_DATA, SetHeatmapDataAction} from "./headmapDataActions";

export type THeatmapDataState = {
  heatmapData: any;
}

type HeatmapDataActions = SetHeatmapDataAction;

export const heatmapDataReducer = (state = initialState.heatmapData, action: HeatmapDataActions): THeatmapDataState => {
  switch (action.type) {
    case SET_HEATMAP_DATA:
      return {
        ...state,
        heatmapData: action.heatmapData,
      }
    default:
      return state;
  }
}
