import React from 'react';
import './mode.css';
import {setModeSwitcher} from '../../store/modeSwitcher/modeSwitcherActions';
import {EModeSwitcher} from "../../types/enums/EModeSwitcher.enum";
import {useSelector, useDispatch} from 'react-redux';
import {TInitialState} from '../../store/reducer';
import classNames from 'classnames';

export default function Mode() {
  const modeSwitcher = useSelector<TInitialState, EModeSwitcher>(state => state.modeSwitcher.modeSwitcher);
  const dispatch = useDispatch();

  function handleChooseClick(e: React.MouseEvent<HTMLButtonElement>) {
    const buttonID = e.currentTarget.id;
    dispatch(setModeSwitcher(buttonID));
  }

  return (
    <div className='mode'>
      <button
        id={EModeSwitcher.polygons}
        className={classNames(
          'mode__button',
          'mode__button__polygons',
          {'mode__button--active': modeSwitcher === EModeSwitcher.polygons}
        )}
        onClick={handleChooseClick}
      >
        Полигоны
      </button>
      <button
        id={EModeSwitcher.heat}
        className={classNames(
          'mode__button',
          'mode__button__heat',
          {'mode__button--active': modeSwitcher === EModeSwitcher.heat}
        )}
        onClick={handleChooseClick}
      >
        Тепловая карта
      </button>
    </div>
  );
}
