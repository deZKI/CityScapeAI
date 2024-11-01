import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import './map.css';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import GeoData from '../../assets/geo_data/geo.json';

export default function Map() {
  const data: any = GeoData;

  // Функция для получения цвета по плотности населения
  const getColor = (d: any) => {
    return d > 1000 ? '#800026' :
      d > 500  ? '#BD0026' :
        d > 200  ? '#E31A1C' :
          d > 100  ? '#FC4E2A' :
            d > 50   ? '#FD8D3C' :
              d > 20   ? '#FEB24C' :
                d > 10   ? '#FED976' :
                  '#FFEDA0';
  };

  // Основной стиль полигона
  const style = (feature: any) => {
    return {
      fillColor: getColor(feature.properties.density),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  // Функция для подсветки района при наведении
  const highlightFeature = (e: any) => {
    const layer = e.target;
    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
    });
    layer.bringToFront();
  };

  // Функция для сброса подсветки
  const resetHighlight = (e: any) => {
    e.target.setStyle(style(e.target.feature));
  };

  // Функция для увеличения до границ района
  const zoomToFeature = (e: any) => {
    e.target._map.fitBounds(e.target.getBounds());
  };

  // Функция для обработки каждого объекта GeoJSON и добавления событий
  const onEachFeature = (feature: any, layer: any) => {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(feature.properties.name);
    }
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    });
  };

  return (
    <MapContainer className="leaflet" center={[55.751244, 37.618423]} zoom={9}>
      <TileLayer
        className="leaflet__tiles"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {GeoData && (
        <GeoJSON data={data} style={style} onEachFeature={onEachFeature} />
      )}
    </MapContainer>
  );
}