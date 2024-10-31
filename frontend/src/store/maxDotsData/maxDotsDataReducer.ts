import {initialState} from "../reducer";
import {SET_MAX_DOTS_DATA, SetMaxDotsDataAction} from "./maxDotsDataActions";

export type TMaxDotsDataState = {
  maxDotsData: any;
}

type MaxDotsDataActions = SetMaxDotsDataAction;

export const maxDotsDataReducer = (state = initialState.maxDotsData, action: MaxDotsDataActions): TMaxDotsDataState => {
  switch (action.type) {
    case SET_MAX_DOTS_DATA:
      return {
        ...state,
        maxDotsData: action.maxDotsData
      }
    default:
      return state;
  }
}
