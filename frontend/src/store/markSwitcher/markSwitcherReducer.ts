import {SET_MARK_SWITCHER, SetMarkSwitcherAction} from "./markSwitcherActions";
import {initialState} from "../reducer";

export type TMarkSwitcherState = {
  markSwitcher: boolean;
}

type MarkSwitcherActions = SetMarkSwitcherAction;

export const markSwitcherReducer = (state = initialState.markSwitcher, action: MarkSwitcherActions): TMarkSwitcherState => {
  switch (action.type) {
    case SET_MARK_SWITCHER:
      return {
        ...state,
        markSwitcher: action.markSwitcher
      }
    default:
      return state;
  }
}