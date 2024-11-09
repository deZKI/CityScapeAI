import {ActionCreator} from "redux";

export const SET_MARK_SWITCHER = 'SET_MARK_SWITCHER';

export type SetMarkSwitcherAction = {
  type: typeof SET_MARK_SWITCHER;
  markSwitcher: boolean;
}

export const setMarkSwitcher: ActionCreator<SetMarkSwitcherAction> = (markSwitcher) => ({
  type: SET_MARK_SWITCHER,
  markSwitcher
})