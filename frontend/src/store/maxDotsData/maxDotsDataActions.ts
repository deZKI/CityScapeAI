import {TMaxDotsData} from "../../types/maxDotsData.type";
import {ActionCreator} from "redux";

export const SET_MAX_DOTS_DATA = 'SET_MAX_DOTS_DATA';

export type SetMaxDotsDataAction = {
  type: typeof SET_MAX_DOTS_DATA;
  maxDotsData: TMaxDotsData;
}

export const setMaxDotsData: ActionCreator<SetMaxDotsDataAction> = (maxDotsData) => ({
  type: SET_MAX_DOTS_DATA,
  maxDotsData
})
