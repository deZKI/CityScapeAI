import {ActionCreator} from "redux";

export const SET_LOADING = 'SET_LOADING';

export type SetLoadingAction = {
  type: typeof SET_LOADING;
  loading: boolean;
}

export const setLoading: ActionCreator<SetLoadingAction> = (loading) => ({
  type: SET_LOADING,
  loading
})