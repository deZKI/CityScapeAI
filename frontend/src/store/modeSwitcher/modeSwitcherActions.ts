import {TModeTypes} from "../../types/modeTypes.type";
import {ActionCreator} from "redux";

export const SET_MODE_SWITCHER = 'SET_MODE_SWITCHER';

export type SetModeSwitcherAction = {
  type: typeof SET_MODE_SWITCHER;
  modeSwitcher: TModeTypes;
}

export const setModeSwitcher: ActionCreator<SetModeSwitcherAction> = (modeSwitcher) => ({
  type: SET_MODE_SWITCHER,
  modeSwitcher
})
