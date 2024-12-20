import React from 'react';
import './districtslist.css';
import {getAvailabilityByColor} from "../../../utils/getAvailabilityByColor";
import {getRandomGradientColor} from "../../../utils/getRandomGradientColor";
import {EAvailability} from "../../../types/enums/EAvailability.enum";
import {TPanelStyles} from "../../../types/types/TPanelStyles.type";
import GeoData from "../../../assets/geoData/polygons.json";
import {TInitialState} from "../../../store/reducer";
import {FeatureCollection} from "geojson";
import {useSelector} from "react-redux";
import Panel from "../Panel";
import * as L from "leaflet";

type DistrictsListProps = {
  mapRef: React.MutableRefObject<L.Map | null>;
};

export default function DistrictsList({ mapRef }: DistrictsListProps) {
  const styles: TPanelStyles = {
    top: '82px',
    bottom: '16px',
    left: '16px',
    width: '316px',
    padding: '16px 16px 0 16px',
    height: "100%",
    maxHeight: "16px"
  };

  const data: FeatureCollection = GeoData as FeatureCollection;
  const activeAvailability = useSelector<TInitialState, EAvailability>(state => state.activeAvailability.activeAvailability);

  const handleZoomToDistrict = (item: any) => {
    if (mapRef.current) {
      const layer = L.geoJSON(item).getBounds();
      mapRef.current.fitBounds(layer);
    }
  };

  return (
    <Panel title='Районы' subtitle='по доступности' showTitle={true} showMenu={true} styles={styles}>
      <ul className='panel__content__list'>
        {data.features.map((item) => {
          const fillColor = getRandomGradientColor();
          const availability = getAvailabilityByColor(fillColor) as EAvailability.low | EAvailability.medium | EAvailability.high;

          if (
            activeAvailability !== EAvailability.all
            && activeAvailability !== availability
          ) return null;

          return (
            <li className='panel__content__item' key={item.properties?.NAME}>
              <button className='panel__content__button' onClick={() => handleZoomToDistrict(item)}>
                {item.properties?.NAME}
              </button>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}