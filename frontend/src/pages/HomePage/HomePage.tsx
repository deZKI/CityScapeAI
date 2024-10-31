import React from 'react';
import styles from './homepage.module.css';
import LogoImage from '../../assets/images/adspotter_logo.png';
import Panel from '../../ui/Panel/Panel';
import Map from '../../ui/Map/Map';

export default function HomePage() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.wrapper}>
          <a className={styles.link} href="/">
            <img className={styles.image} src={LogoImage} alt="логотип" />
          </a>
        </div>
      </header>
      <main className={styles.main}>
        <Panel />
        <Map />
      </main>
    </>
  );
}
