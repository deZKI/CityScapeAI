import {initialState} from "../reducer";
import {SET_CSV_DATA, SetCSVDataAction} from "./csvDataActions";

export type TCSVDataState = {
  csvData: any;
}

type CSVDataActions = SetCSVDataAction;

export const csvDataReducer = (state = initialState.csvData, action: CSVDataActions): TCSVDataState => {
  switch (action.type) {
    case SET_CSV_DATA:
      return {
        ...state,
        csvData: action.csvData
      }
    default:
      return state;
  }
}
