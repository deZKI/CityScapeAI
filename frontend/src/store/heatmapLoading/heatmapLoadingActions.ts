import {ActionCreator} from "redux";

export const SET_HEATMAP_LOADING = 'SET_HEATMAP_LOADING';

export type SetHeatmapLoadingAction = {
  type: typeof SET_HEATMAP_LOADING;
  heatmapLoading: boolean;
}

export const setHeatmapLoading: ActionCreator<SetHeatmapLoadingAction> = (heatmapLoading) => ({
  type: SET_HEATMAP_LOADING,
  heatmapLoading
})