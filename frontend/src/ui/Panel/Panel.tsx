import React from 'react';
import styles from './panel.module.css';
import PanelTitle from '../../ui/PanelTitle/PanelTitle';

export default function Panel() {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <PanelTitle title='Рекламные щиты' subtitle='по охвату' />
      </div>
    </div>
  )
}
