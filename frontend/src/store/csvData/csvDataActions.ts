import {TCSVData} from "../../types/csvData.type";
import {ActionCreator} from "redux";

export const SET_CSV_DATA = 'SET_CSV_DATA';

export type SetCSVDataAction = {
  type: typeof SET_CSV_DATA;
  csvData: TCSVData;
}

export const setCSVData: ActionCreator<SetCSVDataAction> = (csvData) => ({
  type: SET_CSV_DATA,
  csvData
})
