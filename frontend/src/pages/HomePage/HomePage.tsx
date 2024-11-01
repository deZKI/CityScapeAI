import React from 'react';
import './homepage.css';
import LogoImage from '../../assets/images/adspotter_logo.png';
import Panel from '../../ui/Panel/Panel';
import Map from '../../ui/Map/Map';

export default function HomePage() {
  return (
    <>
      <header className='header'>
        <div className='header__container'>
          <a className='header__link' href="/">
            <img className='header__image' src={LogoImage} alt="логотип" />
          </a>
        </div>
      </header>
      <main className='main'>
        <Panel />
        <Map />
      </main>
    </>
  );
}