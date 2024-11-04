import React from 'react';
import './title.css';

type TProps = {
  title: string;
  subtitle?: string;
}

export default function Title({ title, subtitle }: TProps) {
  return (
    <div className='panel__header__container'>
      <h3 className='panel__header__title'>{title}</h3>
      <h4 className='panel__header__subtitle'>{subtitle}</h4>
    </div>
  );
}