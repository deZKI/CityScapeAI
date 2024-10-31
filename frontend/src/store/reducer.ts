import {SET_LOADING, SetLoadingAction} from "./loading/loadingActions";
import {TLoadingState, loadingReducer} from "./loading/loadingReducer";

export type TInitialState = {
  loading: TLoadingState;
}

export const initialState: TInitialState = {
  loading: {
    loading: false
  },
}

type Actions = SetLoadingAction

export const rootReducer = (state = initialState, action: Actions): TInitialState => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: loadingReducer(state.loading, action)
      }
    default:
      return state;
  }
}
