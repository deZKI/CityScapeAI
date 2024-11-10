import {TPolygonsData} from "../../types/types/TPolygonsData.type";
import {Action, ActionCreator} from "redux";
import {TInitialState} from "../reducer";
import {ThunkAction} from "redux-thunk";
import axios from "axios";


export const SET_POLYGONS_DATA = 'SET_POLYGONS_DATA';

export type SetPolygonsDataAction = {
  type: typeof SET_POLYGONS_DATA;
  polygonsData: TPolygonsData[];
}

export const setPolygonsData: ActionCreator<SetPolygonsDataAction> = (polygonsData) => ({
  type: SET_POLYGONS_DATA,
  polygonsData
})

const API_URL = process.env.REACT_APP_API_URL;

export const setPolygonsDataAsync = (): ThunkAction<void, TInitialState, unknown, Action<string>> => (dispatch) => {
  axios.get(`${API_URL}/load_people`)
    .then((response) => {
      const data: TPolygonsData = response.data;

      dispatch(setPolygonsData(data));
    })
    .catch((error) => console.log(error))
}
