import React from 'react';
import './availability.css';
import {EModeSwitcher} from "../../../types/enums/EModeSwitcher.enum";
import {TPanelStyles} from "../../../types/types/TPanelStyles.type";
import {TInitialState} from "../../../store/reducer";
import {useSelector} from "react-redux";
import Panel from "../Panel";

export default function Availability() {
  const modeSwitcher = useSelector<TInitialState, EModeSwitcher>(state => state.modeSwitcher.modeSwitcher)
  const styles: TPanelStyles = {
    right: '16px',
    bottom: '16px',
    padding: '16px',
    width: modeSwitcher === EModeSwitcher.polygons ? '258px' : '420px'
  }

  return (
    <Panel
      title={`${modeSwitcher === EModeSwitcher.polygons ? 'Доступность' : 'Плотность школ и остановок'}`}
      subtitle='услов.ед' showTitle={true}
      showMenu={false}
      styles={styles}
    >
      <div className='panel__content__units'>
        <span className='panel__content__unit'>&gt; 225</span>
        <span className='panel__content__unit'>276</span>
        <span className='panel__content__unit'>350</span>
        <span className='panel__content__unit'>425</span>
      </div>
      <div className='panel__content__bar'></div>
    </Panel>
  );
}