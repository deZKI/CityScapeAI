import {THeatmapData} from "../../types/types/THeatmapData.type";
import {Action, ActionCreator} from "redux";
import {TInitialState} from "../reducer";
import {ThunkAction} from "redux-thunk";
import axios from "axios";

export const SET_MARKERS_COORDINATES = 'SET_MARKERS_COORDINATES';

export type SetMarkersCoordinatesAction = {
  type: typeof SET_MARKERS_COORDINATES;
  markersCoordinates: number[][];
}

export const setMarkersCoordinates: ActionCreator<SetMarkersCoordinatesAction> = (markersCoordinates) => ({
  type: SET_MARKERS_COORDINATES,
  markersCoordinates
})

const API_URL = process.env.REACT_APP_API_URL;

export const setMarkersCoordinatesAsync = (data: any) => (): ThunkAction<void, TInitialState, unknown, Action<string>> => (dispatch) => {
  axios.get(`${API_URL}/infrastructure-map-data`)
    .then((response) => {
      const data: THeatmapData = response.data;

      dispatch(setMarkersCoordinates(data));
    })
    .catch((error) => console.log(error))
}
