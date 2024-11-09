import {setHeatmapLoading} from "../heatmapLoading/heatmapLoadingActions";
import {THeatmapData} from "../../types/types/THeatmapData.type";
import {THeatmapDataState} from "./heatmapDataReducer";
import {Action, ActionCreator} from "redux";
import {TInitialState} from "../reducer";
import {ThunkAction} from "redux-thunk";
import axios from "axios";

export const SET_HEATMAP_DATA = 'SET_HEATMAP_DATA';

export type SetHeatmapDataAction = {
  type: typeof SET_HEATMAP_DATA;
  heatmapData: THeatmapDataState;
}

export const setHeatmapData: ActionCreator<SetHeatmapDataAction> = (heatmapData) => ({
  type: SET_HEATMAP_DATA,
  heatmapData
})

const API_URL = process.env.REACT_APP_API_URL;

export const setHeatmapDataAsync = (): ThunkAction<void, TInitialState, unknown, Action<string>> => (dispatch) => {
  dispatch(setHeatmapLoading(true));

  axios.get(`${API_URL}/infrastructure-map-data`)
    .then((response) => {
      const data: THeatmapData = response.data;

      dispatch(setHeatmapData(data));
      dispatch(setHeatmapLoading(false));
    })
    .catch((error) => console.log(error))
}
