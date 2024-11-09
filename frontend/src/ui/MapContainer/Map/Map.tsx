import React from 'react';
import 'leaflet/dist/leaflet.css';
import './map.css';
import {LeafletMouseEventHandlerFn, PathOptions, StyleFunction} from "leaflet";
import {MapContainer as LeafletMapContainer, TileLayer} from 'react-leaflet';
import {EModeSwitcher} from "../../../types/enums/EModeSwitcher.enum";
import PolygonsLayer from "./PolygonsLayer/PolygonsLayer";
import HeatmapLayer from "./HeatmapLayer/HeatmapLayer";
import {GeoJsonObject} from "geojson";
import * as L from "leaflet";

type TProps = {
  data: GeoJsonObject;
  style: PathOptions | StyleFunction | undefined;
  modeSwitcher: EModeSwitcher;
  createHighlightFeature: (map: L.Map) => LeafletMouseEventHandlerFn | undefined;
  createResetHighlight: (map: L.Map) => LeafletMouseEventHandlerFn | undefined;
  createZoomToFeature: (map: L.Map) => LeafletMouseEventHandlerFn | undefined;
};

export default function Map({
  data,
  style,
  modeSwitcher,
  createHighlightFeature,
  createResetHighlight,
  createZoomToFeature
}: TProps) {
  return (
    <LeafletMapContainer className="leaflet" center={[55.61244, 37.508423]} zoom={9}>
      <TileLayer
        className="leaflet__tiles"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {modeSwitcher === EModeSwitcher.polygons
        ? <PolygonsLayer
            data={data}
            style={style}
            createHighlightFeature={createHighlightFeature}
            createResetHighlight={createResetHighlight}
            createZoomToFeature={createZoomToFeature}
          />
        : <HeatmapLayer />
      }
    </LeafletMapContainer>
  );
};