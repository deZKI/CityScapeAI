import {useEffect} from 'react';
import {useHeatmapData} from "../../../../hooks/useHeatmapData";
import {TInitialState} from "../../../../store/reducer";
import Loader from "../../../Loader/Loader";
import {useSelector} from "react-redux";
import {useMap} from 'react-leaflet';
import * as L from 'leaflet';
import 'leaflet.heat';
import React from 'react';

export default function HeatmapLayer() {
  const heatmapLoading = useSelector<TInitialState, boolean>(state => state.heatmapLoading.heatmapLoading);
  const data = useHeatmapData();
  const map = useMap();

  const processedData: number[][] = data?.infrastructure?.features
    ? data.infrastructure.features.map((feature) => {
      const [longitude, latitude] = feature.geometry.coordinates;
      return [latitude, longitude];
    })
    : [];


  useEffect(() => {
    if (!map || !processedData.length) return;

    const heatmapLayer = (L as any).heatLayer(processedData, {
      radius: 20,
      maxOpacity: 0.8,
      scaleRadius: true,
    });

    heatmapLayer.addTo(map);

    return () => {
      map.removeLayer(heatmapLayer);
    };
  }, [map, heatmapLoading]);

  if (heatmapLoading) {
    return <Loader />;
  }

  return null;
};