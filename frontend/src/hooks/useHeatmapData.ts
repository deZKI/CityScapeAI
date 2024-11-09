import {useEffect} from 'react';
import {setHeatmapDataAsync} from "../store/heatmapData/headmapDataActions";
import {THeatmapData} from "../types/types/THeatmapData.type";
import {useDispatch, useSelector} from "react-redux";
import {TInitialState} from "../store/reducer";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";

export const useHeatmapData = () => {
  const heatmapData = useSelector<TInitialState, THeatmapData>(state => state.heatmapData.heatmapData);
  const dispatch = useDispatch<ThunkDispatch<TInitialState, void, AnyAction>>();

  useEffect(() => {
    dispatch(setHeatmapDataAsync());
  }, []);

  return heatmapData;
}
