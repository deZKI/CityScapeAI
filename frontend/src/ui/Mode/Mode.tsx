import React from 'react';
import styles from './mode.module.css';
import {setModeSwitcher} from '../../store/modeSwitcher/modeSwitcherActions';
import {TModeTypes} from '../../types/modeTypes.type';
import {useSelector, useDispatch} from 'react-redux';
import {TInitialState} from '../../store/reducer';

export default function Mode() {
  const modeSwitcher = useSelector<TInitialState, TModeTypes>(state => state.modeSwitcher.modeSwitcher);
  const dispatch = useDispatch();

  function handleChooseClick(e: React.MouseEvent<HTMLButtonElement>) {
    const buttonID = e.currentTarget.id;
    dispatch(setModeSwitcher(buttonID));
  }

  return (
    <div className={styles.container}>
      <button
        id="banners"
        className={`
          ${styles.button}
          ${styles.button__left}
          ${modeSwitcher === "banners" ? styles.button__active : ""}
        `}
        onClick={handleChooseClick}
      >
        Рекламные щиты
      </button>
      <button
        id="districts"
        className={`
          ${styles.button}
          ${styles.button__right}
          ${modeSwitcher === "districts" ? styles.button__active : ""}
        `}
        onClick={handleChooseClick}
      >
        Районы
      </button>
    </div>
  );
}
