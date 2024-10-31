import React from 'react';
import styles from './analyticslist.module.css';
import PanelUplaodButton from '../PanelUploadButton/PanelUplaodButton';
import {defineTypeOfCoverage} from '../../utils/defineTypeOfCoverage';
import {TCSVData} from '../../types/csvData.type';
import classNames from 'classnames';

type TProps = {
  csvData: TCSVData;
}

export default function AnalyticsList({ csvData }: TProps) {
  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <h4 className={styles.title}>Оценка охвата</h4>
        <div className={styles.coverage}>
          <span className={classNames(styles.coverage__circle, {
            [styles.coverage__circle__high]: csvData.type === 'high',
            [styles.coverage__circle__middle]: csvData.type === 'middle',
            [styles.coverage__circle__low]: csvData.type === 'low',
          })}></span>
          <span className={styles.coverage__type}>{defineTypeOfCoverage(csvData.type)}</span>
          <span className={styles.coverage__prediction}>{csvData.prediction}</span>
        </div>
      </div>
      {csvData.description !== "Описание" &&
        <div className={styles.info}>
          <h4 className={styles.title}>Описание</h4>
          <p className={styles.description}>{csvData.description}</p>
        </div>
      }
      <div className={styles.info}>
        <h4 className={styles.title}>Данные по целевой аудитории</h4>
        <ul className={styles.list}>
          <li className={styles.item}>
            <span className={styles.auditory__title}>Возраст:</span>
            <span className={styles.auditory__data}>{csvData.ageFrom} - {csvData.ageTo}</span>
          </li>
          <li className={styles.item}>
            <span className={styles.auditory__title}>Доход:</span>
            <span className={styles.auditory__data}>{csvData.income}</span>
          </li>
          <li className={styles.item}>
            <span className={styles.auditory__title}>Пол:</span>
            <span className={styles.auditory__data}>{csvData.gender}</span>
          </li>
        </ul>
      </div>
      <div className={styles.button__container}>
        <PanelUplaodButton text="Загрузить новый файл" />
      </div>
    </div>
  );
}
