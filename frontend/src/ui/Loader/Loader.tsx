import React from 'react';
import './loader.css';
import LoaderGif from '../../assets/images/loading.gif';

export default function Loader() {
  return (
    <div className='loader'>
      <img className='loader__gif' src={LoaderGif} alt="Загрузка..." />
    </div>
  )
}
