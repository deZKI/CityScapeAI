import React from 'react';
import './panel.css';
import Title from './Title/Title';
import {TPanelStyles} from "../../types/types/TPanelStyles.type";
import Menu from "./Menu/Menu";

type TProps = {
  title: string;
  subtitle?: string;
  showMenu: boolean;
  styles: TPanelStyles;
  children: React.ReactNode;
}

export default function Panel({ title, subtitle, showMenu, styles, children }: TProps) {
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
      <Menu showMenu={showMenu} />
      <div className='panel__content'>
        {children}
      </div>
    </div>
  )
}