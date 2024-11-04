import React from 'react';
import './mapcontainer.css';
import {PathOptions, LeafletMouseEvent, GeoJSON as LeafletGeoJSON} from 'leaflet';
import GeoData from "../../assets/geo_data/geo2.json";
import {Feature, FeatureCollection} from "geojson";
import * as L from "leaflet";
import Map from './Map/Map';

export default function MapContainer() {
  const data: FeatureCollection = GeoData as FeatureCollection;

  const getColor = (d: number): string => {
    return d > 1000 ? '#800026' :
      d > 500 ? '#BD0026' :
        d > 200 ? '#E31A1C' :
          d > 100 ? '#FC4E2A' :
            d > 50 ? '#FD8D3C' :
              d > 20 ? '#FEB24C' :
                d > 10 ? '#FED976' :
                  '#FFEDA0';
  };

  const style = (feature: Feature | undefined): PathOptions => ({
    fillColor: getColor(feature?.properties?.density || 0),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  });

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
      createHighlightFeature={createHighlightFeature}
      createResetHighlight={createResetHighlight}
      createZoomToFeature={createZoomToFeature}
    />
  );
}