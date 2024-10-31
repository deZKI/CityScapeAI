import React from 'react';
import 'leaflet/dist/leaflet.css';
import './map.css';
import {MapContainer, TileLayer, Marker} from 'react-leaflet';

export default function Map() {
  return (
    <MapContainer className="leaflet" center={[55.751244, 37.618423]} zoom={9}>
      <TileLayer 
        className="leaflet__tiles"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}
