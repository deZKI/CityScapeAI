import React from 'react';
import './panel.css';
import {TPanelStyles} from "../../types/types/TPanelStyles.type";
import Title from './Title/Title';
import Menu from "./Menu/Menu";

type TProps = {
  title?: string;
  subtitle?: string;
  showTitle: boolean;
  showMenu: boolean;
  styles: TPanelStyles;
  children: React.ReactNode;
}

export default function Panel({ title, subtitle, showTitle, showMenu, styles, children }: TProps) {
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
      <Title title={title} showTitle={showTitle} subtitle={subtitle} />
      <Menu showMenu={showMenu} />
      <div className='panel__content'>
        {children}
      </div>
    </div>
  )
}