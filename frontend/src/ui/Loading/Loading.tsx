import React from 'react';
import './loading.css';
import LoaderGif from '../../assets/images/loading.gif';

export default function Loading() {
  return (
    <div className='loading'>
      <img className='loading__gif' src={LoaderGif} alt="Загрузка..." />
    </div>
  )
}
