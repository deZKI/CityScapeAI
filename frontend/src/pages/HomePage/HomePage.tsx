import React from 'react';
import './homepage.css';
import Panel from '../../ui/Panel/Panel';
import MapContainer from '../../ui/MapContainer/MapContainer';

export default function HomePage() {
  return (
    <>
      <main className='main'>
        <Panel />
        <MapContainer />
      </main>
    </>
  );
}