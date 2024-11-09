import React from 'react';
import './switcher.css';
import {setMarkSwitcher} from "../../../store/markSwitcher/markSwitcherActions";
import {TPanelStyles} from "../../../types/types/TPanelStyles.type";
import {useDispatch, useSelector} from "react-redux";
import {TInitialState} from "../../../store/reducer";
import Switch from "react-switch";
import Panel from "../Panel";

export default function MarkSwitcher() {
  const markSwitcher = useSelector<TInitialState, boolean>(state => state.markSwitcher.markSwitcher);
  const styles: TPanelStyles = { top: '16px', right: '16px', padding: '16px', width: '258px' };
  const dispatch = useDispatch();

  const handleSwitcherChange = () =>
    dispatch(setMarkSwitcher(!markSwitcher));

  return (
    <Panel showTitle={false} showMenu={false} styles={styles}>
      <div className='panel__content__switcher'>
          <Switch
            width={40}
            height={24}
            onColor='#56D941'
            handleDiameter={18}
            checkedIcon={false}
            uncheckedIcon={false}
            checked={markSwitcher}
            onChange={handleSwitcherChange}
          />
          <span className='panel__content__text'>
            Размещение меток
          </span>
      </div>
    </Panel>
  );
}