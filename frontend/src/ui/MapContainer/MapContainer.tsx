import React from 'react';
import './mapcontainer.css';
import {PathOptions, LeafletMouseEvent, GeoJSON as LeafletGeoJSON} from 'leaflet';
import {getRandomGradientColor} from "../../utils/getRandomGradientColor";
import {getAvailabilityByColor} from "../../utils/getAvailabilityByColor";
import {EModeSwitcher} from "../../types/enums/EModeSwitcher.enum";
import {EAvailability} from "../../types/enums/EAvailability.enum";
import GeoData from "../../assets/geoData/polygons.json";
import {Feature, FeatureCollection} from "geojson";
import {TInitialState} from "../../store/reducer";
import {useSelector} from "react-redux";
import * as L from "leaflet";
import Map from './Map/Map';

export default function MapContainer() {
  const activeAvailability = useSelector<TInitialState, EAvailability>(state => state.activeAvailability.activeAvailability);
  const modeSwitcher = useSelector<TInitialState, EModeSwitcher>(state => state.modeSwitcher.modeSwitcher);
  const markSwitcher = useSelector<TInitialState, boolean>(state => state.markSwitcher.markSwitcher);
  const data: FeatureCollection = GeoData as FeatureCollection;

  const style = (feature: Feature | undefined): PathOptions => {
    const fillColor = !markSwitcher ? getRandomGradientColor() : 'transparent';
    const availability = getAvailabilityByColor(fillColor);
    const isVisible = activeAvailability === EAvailability.all || activeAvailability === availability;

    return {
      fillColor: isVisible ? fillColor : 'transparent',
      weight: 2,
      opacity: isVisible ? 1 : 0,
      color: 'white',
      dashArray: '3',
      fillOpacity: isVisible ? 0.7 : 0
    };
  };

  const createHighlightFeature = (map: L.Map) => (e: LeafletMouseEvent): void => {
    const layer = e.target as LeafletGeoJSON;

    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  };

  const createResetHighlight = (map: L.Map) => (e: LeafletMouseEvent): void => {
    const layer = e.target as LeafletGeoJSON;
    const feature = layer.feature as Feature | undefined;

    layer.setStyle(style(feature));
  };

  const createZoomToFeature = (map: L.Map) => (e: LeafletMouseEvent): void => {
    const layer = e.target as LeafletGeoJSON;
    const bounds = layer.getBounds();

    map.fitBounds(bounds);
  };

  return (
    <Map
      data={data}
      style={style}
      modeSwitcher={modeSwitcher}
      markSwitcher={markSwitcher}
      createHighlightFeature={createHighlightFeature}
      createResetHighlight={createResetHighlight}
      createZoomToFeature={createZoomToFeature}
    />
  );
}