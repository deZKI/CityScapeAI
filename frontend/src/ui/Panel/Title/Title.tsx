import React from 'react';
import './title.css';

type TProps = {
  title?: string;
  showTitle: boolean;
  subtitle?: string;
}

export default function Title({ title, showTitle, subtitle }: TProps) {
  return (
    <div className='panel__header' style={showTitle ? { display: 'flex' } : { display: 'none' }}>
      <div className='panel__header__container'>
        <h3 className='panel__header__title'>{title}</h3>
        <h4 className='panel__header__subtitle'>{subtitle}</h4>
      </div>
    </div>
  );
}