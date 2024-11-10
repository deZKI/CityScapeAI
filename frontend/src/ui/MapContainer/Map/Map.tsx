import React, { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import './map.css';
import {MapContainer as LeafletMapContainer, TileLayer, useMap} from 'react-leaflet';
import {LeafletMouseEventHandlerFn, PathOptions, StyleFunction} from "leaflet";
import {EModeSwitcher} from "../../../types/enums/EModeSwitcher.enum";
import PolygonsLayer from "./PolygonsLayer/PolygonsLayer";
import HeatmapLayer from "./HeatmapLayer/HeatmapLayer";
import {GeoJsonObject} from "geojson";
import * as L from "leaflet";

type TProps = {
  data: GeoJsonObject;
  style: PathOptions | StyleFunction | undefined;
  mapRef: React.MutableRefObject<L.Map | null>;
  modeSwitcher: EModeSwitcher;
  markSwitcher: boolean;
  createHighlightFeature: (map: L.Map) => LeafletMouseEventHandlerFn | undefined;
  createResetHighlight: (map: L.Map) => LeafletMouseEventHandlerFn | undefined;
  createZoomToFeature: (map: L.Map) => LeafletMouseEventHandlerFn | undefined;
};

export default function Map({
  data,
  style,
  mapRef,
  modeSwitcher,
  markSwitcher,
  createHighlightFeature,
  createResetHighlight,
  createZoomToFeature,
}: TProps) {
  function SetMapInstance() {
    const map = useMap();

    useEffect(() => {
      mapRef.current = map;
    }, [map]);

    return null;
  }

  return (
    <LeafletMapContainer
      className="leaflet"
      center={[55.61244, 37.508423]}
      zoom={9}
      whenReady={() => {
        if (mapRef.current) {}
      }}
    >
      <SetMapInstance />
      <TileLayer
        className="leaflet__tiles"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {modeSwitcher === EModeSwitcher.polygons ? (
        <PolygonsLayer
          data={data}
          style={style}
          markSwitcher={markSwitcher}
          createHighlightFeature={createHighlightFeature}
          createResetHighlight={createResetHighlight}
          createZoomToFeature={createZoomToFeature}
        />
      ) : (
        <HeatmapLayer />
      )}
    </LeafletMapContainer>
  );
}