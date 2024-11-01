import React from 'react';
import './panel.css';
import PanelTitle from '../../ui/PanelTitle/PanelTitle';

export default function Panel() {
  return (
    <div className='panel'>
      <div className='panel__header'>
        <PanelTitle title='Рекламные щиты' subtitle='по охвату' />
      </div>
    </div>
  )
}