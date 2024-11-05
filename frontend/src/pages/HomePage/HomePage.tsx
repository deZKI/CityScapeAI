import React from 'react';
import './homepage.css';
import DistrictsList from "../../ui/Panel/DistrictsList/DistrictsList";
import Availability from "../../ui/Panel/Availability/Availability";
import MapContainer from '../../ui/MapContainer/MapContainer';

export default function HomePage() {
  return (
    <>
      <main className='main'>
        <MapContainer />
        <DistrictsList />
        <Availability />
      </main>
    </>
  );
}