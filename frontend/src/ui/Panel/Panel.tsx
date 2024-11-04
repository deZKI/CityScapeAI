import React from 'react';
import './panel.css';
import Title from './Title/Title';
import {TPanelPositionStyles} from "../../types/TPanelPositionStyles.type";

type TProps = {
  title: string;
  subtitle?: string;
  position: TPanelPositionStyles;
  children: React.ReactNode;
}

export default function Panel({ title, subtitle, position, children }: TProps) {
  return (
    <div className='panel' style={{
      top: position.top,
      right: position.right,
      bottom: position.bottom,
      left: position.left,
      width: position.width,
      maxHeight: `calc(100% - ${position.maxHeight})`
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