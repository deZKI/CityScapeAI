import {ActionCreator} from "redux";
import {EModeSwitcher} from "../../types/enums/EModeSwitcher.enum";

export const SET_MODE_SWITCHER = 'SET_MODE_SWITCHER';

export type SetModeSwitcherAction = {
  type: typeof SET_MODE_SWITCHER;
  modeSwitcher: EModeSwitcher;
}

export const setModeSwitcher: ActionCreator<SetModeSwitcherAction> = (modeSwitcher) => ({
  type: SET_MODE_SWITCHER,
  modeSwitcher
})