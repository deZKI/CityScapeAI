import {initialState} from "../reducer";
import {SET_POLYGONS_DATA, SetPolygonsDataAction} from "./polygonsDataActions";

export type TPolygonsDataState = {
  polygonsData: any;
}

type PolygonsDataActions = SetPolygonsDataAction;

export const polygonsDataReducer = (state = initialState.polygonsData, action: PolygonsDataActions): TPolygonsDataState => {
  switch (action.type) {
    case SET_POLYGONS_DATA:
      return {
        ...state,
        polygonsData: action.polygonsData,
      }
    default:
      return state;
  }
}
