import {useEffect} from 'react';
import './customcursor.css';
import {useMap} from "react-leaflet";

export default function CustomCursor() {
  const map = useMap();

  useEffect(() => {
    map.getContainer().style.cursor = "url('../../assets/images/mark.cur')";

    return () => {map.getContainer().style.cursor = ''};
  }, [map]);

  return null;
}