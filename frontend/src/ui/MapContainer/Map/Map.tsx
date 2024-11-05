import React from 'react';
import 'leaflet/dist/leaflet.css';
import './map.css';
import {LeafletMouseEventHandlerFn, PathOptions, StyleFunction} from "leaflet";
import {MapContainer as LeafletMapContainer, TileLayer} from 'react-leaflet';
import GeoJSONLayer from "./GeoJsonLayer/GeoJsonLayer";
import {GeoJsonObject} from "geojson";
import * as L from "leaflet";

type TProps = {
  data: GeoJsonObject;
  style: PathOptions | StyleFunction | undefined;
  createHighlightFeature: (map: L.Map) => LeafletMouseEventHandlerFn | undefined;
  createResetHighlight: (map: L.Map) => LeafletMouseEventHandlerFn | undefined;
  createZoomToFeature: (map: L.Map) => LeafletMouseEventHandlerFn | undefined;
};

export default function Map({ data, style, createHighlightFeature, createResetHighlight, createZoomToFeature }: TProps) {
  return (
    <LeafletMapContainer className="leaflet" center={[55.61244, 37.508423]} zoom={9}>
      <TileLayer
        className="leaflet__tiles"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSONLayer
        data={data}
        style={style}
        createHighlightFeature={createHighlightFeature}
        createResetHighlight={createResetHighlight}
        createZoomToFeature={createZoomToFeature}
      />
    </LeafletMapContainer>
  );
};