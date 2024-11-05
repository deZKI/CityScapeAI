import React from 'react';
import './panel.css';
import Title from './Title/Title';
import {TPanelStyles} from "../../types/TPanelStyles.type";

type TProps = {
  title: string;
  subtitle?: string;
  styles: TPanelStyles;
  children: React.ReactNode;
}

export default function Panel({ title, subtitle, styles, children }: TProps) {
  return (
    <div className='panel' style={{
      top: styles.top,
      right: styles.right,
      bottom: styles.bottom,
      left: styles.left,
      padding: styles.padding,
      width: styles.width,
      maxHeight: `calc(100% - ${styles.maxHeight})`
    }}>
      <div className='panel__header'>
        <Title title={title} subtitle={subtitle} />
      </div>
      <div className='panel__content'>
        {children}
      </div>
    </div>
  )
}