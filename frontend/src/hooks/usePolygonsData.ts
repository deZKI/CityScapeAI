import {useEffect} from 'react';
import {setPolygonsDataAsync} from "../store/polygonsData/polygonsDataActions";
import {TPolygonsData} from "../types/types/TPolygonsData.type";
import {useDispatch, useSelector} from "react-redux";
import {TInitialState} from "../store/reducer";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";

export const usePolygonsData = () => {
  const polygonsData = useSelector<TInitialState, TPolygonsData[]>(state => state.polygonsData.polygonsData);
  const dispatch = useDispatch<ThunkDispatch<TInitialState, void, AnyAction>>();

  useEffect(() => {
    dispatch(setPolygonsDataAsync());
  }, []);

  return polygonsData;
}
