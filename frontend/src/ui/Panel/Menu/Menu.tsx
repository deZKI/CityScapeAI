import React from 'react';
import './menu.css';
import {setActiveAvailability} from "../../../store/activeAvailability/activeAvailabilityActions";
import {EAvailability} from "../../../types/enums/EAvailability.enum";
import {useDispatch, useSelector} from "react-redux";
import {TInitialState} from "../../../store/reducer";
import classNames from "classnames";

type TProps = {
  showMenu: boolean;
}

export default function Menu({ showMenu }: TProps) {
  const activeAvailability = useSelector<TInitialState, EAvailability>(state => state.activeAvailability.activeAvailability);
  const dispatch = useDispatch();

  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const targetElement = event.target as HTMLElement;
    const targetElementId = targetElement.id as EAvailability;

    dispatch(setActiveAvailability(targetElementId));
  }

  return (
    <nav className='panel__menu' style={showMenu ? { display: 'flex' } : { display: 'none' }}>
      <ul className='panel__menu__list'>
        <li className='panel__menu__item'>
          <button
            id={EAvailability.all}
            className={classNames('panel__menu__button', 'panel__menu__button--all ', {
              ['panel__menu__button--all--active']: activeAvailability === EAvailability.all,
            })}
            onClick={handleButtonClick}
          >Все</button>
        </li>
        <li className='panel__menu__item'>
          <button
            id={EAvailability.high}
            className={classNames('panel__menu__button', 'panel__menu__button--high ', {
              ['panel__menu__button--high--active']: activeAvailability === EAvailability.high,
            })}
            onClick={handleButtonClick}
          >Высокая</button>
        </li>
        <li className='panel__menu__item'>
          <button
            id={EAvailability.medium}
            className={classNames('panel__menu__button', 'panel__menu__button--medium ', {
              ['panel__menu__button--medium--active']: activeAvailability === EAvailability.medium,
            })}
            onClick={handleButtonClick}
          >Средняя</button>
        </li>
        <li className='panel__menu__item'>
          <button
            id={EAvailability.low}
            className={classNames('panel__menu__button', 'panel__menu__button--low ', {
              ['panel__menu__button--low--active']: activeAvailability === EAvailability.low,
            })}
            onClick={handleButtonClick}
          >Низкая</button>
        </li>
      </ul>
    </nav>
  )
}