import React, { useMemo } from 'react';
import './mapcontainer.css';
import { PathOptions, LeafletMouseEvent, GeoJSON as LeafletGeoJSON } from 'leaflet';
import { Feature, FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import { getAvailabilityByColor } from "../../utils/getAvailabilityByColor";
import { EModeSwitcher } from "../../types/enums/EModeSwitcher.enum";
import { EAvailability } from "../../types/enums/EAvailability.enum";
import { usePolygonsData } from "../../hooks/usePolygonsData";
import { getDensityColor } from "../../utils/getDensityColor";
import GeoDataRaw from "../../assets/geoData/polygons.json";
import { TInitialState } from "../../store/reducer";
import { useSelector } from "react-redux";
import Loader from "../Loader/Loader";
import * as L from "leaflet";
import Map from './Map/Map';

type EnhancedProperties = GeoJsonProperties & {
  load_people: number;
};

const GeoData: FeatureCollection<Geometry, GeoJsonProperties> = GeoDataRaw as FeatureCollection<Geometry, GeoJsonProperties>;

type MapContainerProps = {
  mapRef: React.MutableRefObject<L.Map | null>;
};

export default function MapContainer({ mapRef }: MapContainerProps) {
  const activeAvailability = useSelector<TInitialState, EAvailability>(state => state.activeAvailability.activeAvailability);
  const modeSwitcher = useSelector<TInitialState, EModeSwitcher>(state => state.modeSwitcher.modeSwitcher);
  const markSwitcher = useSelector<TInitialState, boolean>(state => state.markSwitcher.markSwitcher);
  const polygonsData = usePolygonsData();

  const districtToLoadMap = useMemo(() => {
    const map: { [district: string]: number } = {};

    polygonsData.forEach(data => {
      map[data.district] = data.load_people;
    });

    return map;
  }, [polygonsData]);

  const enhancedData: FeatureCollection<Geometry, EnhancedProperties> = useMemo(() => {
    return {
      type: "FeatureCollection",
      features: GeoData.features.map(feature => {
        const districtName = feature?.properties?.NAME;
        const load_people = districtName ? districtToLoadMap[districtName] ?? 0 : 0;

        return {
          ...feature,
          properties: {
            ...feature.properties,
            load_people,
          },
        };
      }),
    };
  }, [GeoData, districtToLoadMap]);

  const minLoad = useMemo(() => {
    return polygonsData.length > 0 ? Math.min(...polygonsData.map(d => d.load_people)) : 0;
  }, [polygonsData]);

  const maxLoad = useMemo(() => {
    return polygonsData.length > 0 ? Math.max(...polygonsData.map(d => d.load_people)) : 0;
  }, [polygonsData]);

  const style = useMemo(() => {
    return (feature: Feature<Geometry, EnhancedProperties> | undefined): PathOptions => {
      const load = feature?.properties?.load_people ?? 0;
      const fillColor = getDensityColor(load, minLoad, maxLoad);
      const availability = getAvailabilityByColor(fillColor);

      const isVisible =
        activeAvailability === EAvailability.all || activeAvailability === availability;

      return {
        fillColor: isVisible ? fillColor : 'transparent',
        weight: 2,
        opacity: isVisible ? 1 : 0,
        color: 'white',
        dashArray: '3',
        fillOpacity: isVisible ? 0.7 : 0,
      };
    };
  }, [activeAvailability, minLoad, maxLoad]);

  const createHighlightFeature = (map: L.Map) => (e: LeafletMouseEvent): void => {
    const layer = e.target as LeafletGeoJSON;

    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7,
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  };

  const createResetHighlight = (map: L.Map) => (e: LeafletMouseEvent): void => {
    const layer = e.target as LeafletGeoJSON;
    const feature = layer.feature as Feature<Geometry, EnhancedProperties> | undefined;

    layer.setStyle(style(feature));
  };

  const createZoomToFeature = (map: L.Map) => (e: LeafletMouseEvent): void => {
    const layer = e.target as LeafletGeoJSON;
    const bounds = layer.getBounds();

    map.fitBounds(bounds);
  };

  if (!polygonsData || polygonsData.length === 0) {
    return <Loader />;
  }

  return (
    <Map
      data={enhancedData} // Use the enhanced GeoJSON data
      style={style}
      mapRef={mapRef}
      modeSwitcher={modeSwitcher}
      markSwitcher={markSwitcher}
      createHighlightFeature={createHighlightFeature}
      createResetHighlight={createResetHighlight}
      createZoomToFeature={createZoomToFeature}
    />
  );
}