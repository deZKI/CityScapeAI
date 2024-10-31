import React from 'react';
import 'leaflet/dist/leaflet.css';
import './map.css';
import {generateRandomString} from '../../utils/generateRandomString';
import {MapContainer, TileLayer, Marker} from 'react-leaflet';
import {TMaxDotsData} from '../../types/maxDotsData.type';
import {getIconByType} from '../../utils/getIconByType';
import {TCSVData} from '../../types/csvData.type';
import {TMode} from '../../types/mode.type';

type TMap = {
  csvData: TCSVData;
  maxDotsData: TMaxDotsData;
  modeSwitcher: TMode;
}

export default function Map({ csvData, maxDotsData, modeSwitcher }: TMap) {
  return (
    <MapContainer className="leaflet" center={[55.751244, 37.618423]} zoom={10}>
      <TileLayer 
        className="leaflet__tiles"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {Object.keys(csvData).length !== 0 && modeSwitcher === "banners" &&
        csvData.points.map((point) => 
          <Marker 
            position={[point.lat, point.lon]} 
            icon={getIconByType(csvData.type)}
            key={generateRandomString()}
          />
        )
      }
      {Object.keys(maxDotsData).length !== 0 && modeSwitcher === "districts" &&
        maxDotsData.max_dots.map((coordinates) => 
          <Marker 
            position={[Number(coordinates[0]), Number(coordinates[1])]} 
            icon={getIconByType("none")}
            key={generateRandomString()}
          />
        )
      }
    </MapContainer>
  );
}
