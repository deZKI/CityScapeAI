import React from 'react';
import './homepage.css';
import DistrictsList from "../../ui/Panel/DistrictsList/DistrictsList";
import Availability from "../../ui/Panel/Availability/Availability";
import MarkSwitcher from "../../ui/Panel/MarkSwitcher/Switcher";
import MapContainer from '../../ui/MapContainer/MapContainer';
import Mode from "../../ui/Mode/Mode";

export default function HomePage() {
  return (
    <main className='main'>
      <MapContainer />
      <Mode />
      <DistrictsList />
      <MarkSwitcher />
      <Availability />
    </main>
  );
}