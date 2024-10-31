import React from 'react';
import styles from './homepage.module.css';
import LogoImage from '../../assets/images/adspotter_logo.png';
import {TMaxDotsData} from '../../types/maxDotsData.type';
import {TInitialState} from '../../store/reducer';
import {TCSVData} from '../../types/csvData.type';
import {TMode} from '../../types/mode.type';
import Panel from '../../ui/Panel/Panel';
import {useSelector} from 'react-redux';
import Mode from '../../ui/Mode/Mode';
import Map from '../../ui/Map/Map';

export default function HomePage() {
  const maxDotsData = useSelector<TInitialState, TMaxDotsData>(state => state.maxDotsData.maxDotsData);
  const modeSwitcher = useSelector<TInitialState, TMode>(state => state.modeSwitcher.modeSwitcher);
  const csvData = useSelector<TInitialState, TCSVData>(state => state.csvData.csvData);

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
        <Mode />
        <Panel csvData={csvData} maxDotsData={maxDotsData} modeSwitcher={modeSwitcher} />
        <Map csvData={csvData} maxDotsData={maxDotsData} modeSwitcher={modeSwitcher} />
      </main>
    </>
  );
}
