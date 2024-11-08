import {SET_MODE_SWITCHER, SetModeSwitcherAction} from "./modeSwitcherActions";
import {EModeSwitcher} from "../../types/enums/EModeSwitcher.enum";
import {initialState} from "../reducer";

export type TModeSwitcherState = {
  modeSwitcher: EModeSwitcher;
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