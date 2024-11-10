import {initialState} from "../reducer";
import {SET_MARKERS_COORDINATES, SetMarkersCoordinatesAction} from "./markersCoordinatesActions";

export type TMarkersCoordinatesState = {
  markersCoordinates: any;
}

type MarkersCoordinatesActions = SetMarkersCoordinatesAction;

export const markersCoordinatesReducer = (state = initialState.markersCoordinates, action: MarkersCoordinatesActions): TMarkersCoordinatesState => {
  switch (action.type) {
    case SET_MARKERS_COORDINATES:
      return {
        ...state,
        markersCoordinates: action.markersCoordinates,
      }
    default:
      return state;
  }
}
