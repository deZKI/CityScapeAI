import React from 'react';
import './districtslist.css';
import {TPanelStyles} from "../../../types/types/TPanelStyles.type";
import GeoData from "../../../assets/geo_data/geo.json";
import {FeatureCollection} from "geojson";
import Panel from "../Panel";

export default function DistrictsList() {
  const styles: TPanelStyles = {
    top: '16px',
    bottom: '16px',
    left: '16px',
    width: '316px',
    padding: '16px 16px 0 16px',
    height: "100%",
    maxHeight: "16px"
  };
  const data: FeatureCollection = GeoData as FeatureCollection;

  return (
    <Panel title='Районы' subtitle='по доступности' showMenu={true} styles={styles}>
      <ul className='panel__content__list'>
        {data.features.map((item) =>
          <li className='panel__content__item' key={item.properties?.NAME}>
            <button className='panel__content__button'>
              {item.properties?.NAME}
            </button>
          </li>
        )}
      </ul>
    </Panel>
  );
}