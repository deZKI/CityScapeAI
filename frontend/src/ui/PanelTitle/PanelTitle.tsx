import React from 'react';
import styles from './paneltitle.module.css';

type TProps = {
  title: string;
  subtitle?: string;
}

export default function PanelTitle({ title, subtitle }: TProps) {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{title}</h3>
      <h4 className={styles.subtitle}>{subtitle}</h4>
    </div>
  );
}
