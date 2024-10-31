import React from 'react';
import styles from './loading.module.css';
import LoaderGif from '../../assets/images/loading.gif';

export default function Loading() {
  return (
    <div className={styles.container}>
      <img className={styles.loader} src={LoaderGif} alt="Загрузка..." />
    </div>
  )
}
