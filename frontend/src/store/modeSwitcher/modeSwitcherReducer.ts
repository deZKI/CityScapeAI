import {SET_MODE_SWITCHER, SetModeSwitcherAction} from "./modeSwitcherActions";
import {TModeTypes} from "../../types/modeTypes.type";
import {initialState} from "../reducer";

export type TModeSwitcherState = {
  modeSwitcher: TModeTypes;
}

type ModeSwitcherActions = SetModeSwitcherAction;

export const modeSwitcherReducer = (state = initialState.modeSwitcher, action: ModeSwitcherActions): TModeSwitcherState => {
  switch (action.type) {
    case SET_MODE_SWITCHER:
      return {
        ...state,
        modeSwitcher: action.modeSwitcher
      }
    default:
      return state;
  }
}
