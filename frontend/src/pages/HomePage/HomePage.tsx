import React from 'react';
import './homepage.css';
import MapContainer from '../../ui/MapContainer/MapContainer';
import Availability from "../../ui/Panel/Availability/Availability";

export default function HomePage() {
  return (
    <>
      <main className='main'>
        <MapContainer />
        <Availability />
      </main>
    </>
  );
}