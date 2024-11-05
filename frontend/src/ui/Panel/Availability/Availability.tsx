import React from 'react';
import './availability.css';
import {TPanelStyles} from "../../../types/types/TPanelStyles.type";
import Panel from "../Panel";

export default function Availability() {
  const styles: TPanelStyles = { right: '16px', bottom: '16px', padding: '16px', width: '258px' }

  return (
    <Panel title='Доступность' subtitle='услов.ед' showMenu={false} styles={styles}>
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