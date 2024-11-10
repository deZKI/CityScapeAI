import React, {useEffect, useRef, useState} from 'react';
import 'leaflet/dist/leaflet.css';
import './map.css';
import {MapContainer as LeafletMapContainer, Marker, Popup, TileLayer, useMap, useMapEvents} from 'react-leaflet';
import {LeafletMouseEventHandlerFn, PathOptions, StyleFunction} from "leaflet";
import {EModeSwitcher} from "../../../types/enums/EModeSwitcher.enum";
import PolygonsLayer from "./PolygonsLayer/PolygonsLayer";
import {TMarker} from "../../../types/types/TMarker.type";
import MarkerPopup from "../../MarkerPopup/MarkerPopup";
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
  const [markers, setMarkers] = useState<TMarker[]>([]);
  const markerRefs = useRef<(L.Marker | null)[]>([]);

  const handleFormSubmit = (index: number, data: { name: string; description: string }) => {
    setMarkers(prevMarkers =>
      prevMarkers.map((marker, idx) =>
        idx === index ? { ...marker, formData: data } : marker
      )
    );
  };

  useEffect(() => {
    // Open the latest popup
    const latestMarker = markerRefs.current[markers.length - 1];
    if (latestMarker) {
      latestMarker.openPopup();
    }
  }, [markers]);


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
        if (mapRef.current) {
        }
      }}
    >
      <SetMapInstance/>
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
        <HeatmapLayer/>
      )}
      {markers.map((marker, idx) => (
        <Marker
          key={idx}
          position={marker.position}
          ref={el => (markerRefs.current[idx] = el)}
        >
          <Popup>
            <MarkerPopup
              position={marker.position}
              onSubmit={(formData) => handleFormSubmit(idx, formData)}
            />
          </Popup>
        </Marker>
      ))}
    </LeafletMapContainer>
  );
}