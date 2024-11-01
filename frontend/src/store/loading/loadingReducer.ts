import {SET_LOADING, SetLoadingAction} from "./loadingActions";
import {initialState} from "../reducer";

export type TLoadingState = {
  loading: boolean;
}

type LoadingActions = SetLoadingAction;

export const loadingReducer = (state = initialState.loading, action: LoadingActions): TLoadingState => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: action.loading
      }
    default:
      return state;
  }
}