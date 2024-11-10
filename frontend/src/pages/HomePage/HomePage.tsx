import React, {useRef} from 'react';
import './homepage.css';
import DistrictsList from "../../ui/Panel/DistrictsList/DistrictsList";
import Availability from "../../ui/Panel/Availability/Availability";
import MarkSwitcher from "../../ui/Panel/MarkSwitcher/MarkSwitcher";
import MapContainer from '../../ui/MapContainer/MapContainer';
import Mode from "../../ui/Mode/Mode";
import * as L from 'leaflet';

export default function HomePage() {
  const mapRef = useRef<L.Map | null>(null);

  return (
    <main className='main'>
      <MapContainer mapRef={mapRef} />
      <Mode />
      <DistrictsList mapRef={mapRef} />
      <MarkSwitcher />
      <Availability />
    </main>
  );
}
