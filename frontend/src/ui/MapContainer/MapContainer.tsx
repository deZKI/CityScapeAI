import React, {useEffect, useRef} from 'react';
import './mapcontainer.css';
import {PathOptions, LeafletMouseEvent, GeoJSON as LeafletGeoJSON, map} from 'leaflet';
import {getRandomGradientColor} from "../../utils/getRandomGradientColor";
import {EModeSwitcher} from "../../types/enums/EModeSwitcher.enum";
import GeoData from "../../assets/geo_data/polygons.json";
import {Feature, FeatureCollection} from "geojson";
import {TInitialState} from "../../store/reducer";
import {useSelector} from "react-redux";
import * as L from "leaflet";
import Map from './Map/Map';

export default function MapContainer() {
  const modeSwitcher = useSelector<TInitialState, EModeSwitcher>(state => state.modeSwitcher.modeSwitcher);
  const markSwitcher = useSelector<TInitialState, boolean>(state => state.markSwitcher.markSwitcher);
  const data: FeatureCollection = GeoData as FeatureCollection;

  const style = (feature: Feature | undefined): PathOptions => ({
    fillColor: !markSwitcher ? getRandomGradientColor() : 'transparent',
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  });

  const createHighlightFeature = (map: L.Map) => (e: LeafletMouseEvent): void => {
    if (markSwitcher) return;

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
    if (markSwitcher) return;

    const layer = e.target as LeafletGeoJSON;
    const feature = layer.feature as Feature | undefined;

    layer.setStyle(style(feature));
  };

  const createZoomToFeature = (map: L.Map) => (e: LeafletMouseEvent): void => {
    if (markSwitcher) return;

    const layer = e.target as LeafletGeoJSON;
    const bounds = layer.getBounds();

    map.fitBounds(bounds);
  };

  return (
    <Map
      data={data}
      style={style}
      modeSwitcher={modeSwitcher}
      createHighlightFeature={createHighlightFeature}
      createResetHighlight={createResetHighlight}
      createZoomToFeature={createZoomToFeature}
    />
  );
}