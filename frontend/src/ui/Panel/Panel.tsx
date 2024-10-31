import React from 'react';
import styles from './panel.module.css';
import PanelUplaodButton from '../PanelUploadButton/PanelUplaodButton';
import AnalyticsList from '../AnalyticsList/AnalyticsList';
import PanelTitle from '../../ui/PanelTitle/PanelTitle';
import {TCSVData} from '../../types/csvData.type';
import {TInitialState} from '../../store/reducer';
import {TMode} from '../../types/mode.type';
import Loading from '../Loading/Loading';
import {useSelector} from 'react-redux';
import Filter from '../Filter/Filter';
import { TMaxDotsData } from '../../types/maxDotsData.type';

type TPanel = {
  csvData: TCSVData;
  maxDotsData: TMaxDotsData
  modeSwitcher: TMode;
}

export default function Panel({ csvData, maxDotsData, modeSwitcher }: TPanel) {
  const loading = useSelector<TInitialState, boolean>(state => state.loading.loading);

  return (
    <div className={styles.panel}>
      {/* {!loading
          ? Object.keys(csvData).length !== 0 && modeSwitcher === 'banners'
              ? <>
                  <div className={styles.header}>
                    <PanelTitle title='Рекламные щиты' subtitle='по охвату' />
                  </div>
                  <AnalyticsList csvData={csvData} />
                </>
              : <div className={styles.button__container}>
                  <PanelUplaodButton text='Выберите файл' />
                </div>
          : <Loading />
      }
      {!loading
          ? modeSwitcher === 'districts'
              ? <div className={styles.header}>
                  <PanelTitle title='Рекламные щиты' subtitle='по охвату' />
                  <Filter />
                </div>
              : <div className={styles.header}>
                  <PanelTitle title='Рекламные щиты' subtitle='по охвату' />
                  <Filter />
                </div>
          : <Loading />
      } */}
      {!loading
        ? Object.keys(csvData).length !== 0
          ? modeSwitcher === "districts"
              ? <div className={styles.header}>
                  <PanelTitle 
                    title='Рекламные щиты' 
                    subtitle={`${maxDotsData.max_value}`.slice(0.5)} 
                  />
                  <Filter />
                </div>
              : <>
                  <div className={styles.header}>
                    <PanelTitle title='Рекламные щиты' subtitle='по охвату' />
                  </div>
                  <AnalyticsList csvData={csvData} />
                </>
          : Object.keys(maxDotsData).length === 0 && modeSwitcher === 'districts'
              ? <div className={styles.header}>
                  <PanelTitle title='Рекламные щиты' subtitle={`${maxDotsData.max_value}`.slice(0.5)} />
                  <Filter />
                </div>
              : <div className={styles.button__container}>
                  <PanelUplaodButton text='Выберите файл' />
                </div>
        : <Loading />
      }
    </div>
  )
}
