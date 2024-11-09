import React, {useEffect} from "react";
import {Layer, LeafletMouseEventHandlerFn, PathOptions, StyleFunction} from "leaflet";
import {GeoJSON, GeoJSONProps, useMap} from "react-leaflet";
import {Feature, GeoJsonObject, Geometry} from "geojson";
import * as L from "leaflet";

type TProps = {
  data: GeoJsonObject;
  style: PathOptions | StyleFunction | undefined;
  markSwitcher: boolean;
  createHighlightFeature: (map: L.Map) => LeafletMouseEventHandlerFn | undefined;
  createResetHighlight: (map: L.Map) => LeafletMouseEventHandlerFn | undefined;
  createZoomToFeature: (map: L.Map) => LeafletMouseEventHandlerFn | undefined;
};

export default function PolygonsLayer({
  data,
  style,
  markSwitcher,
  createHighlightFeature,
  createResetHighlight,
  createZoomToFeature
}: TProps) {
  const map = useMap();

  useEffect(() => {
    const geoJsonLayer = new L.GeoJSON(data, {
      style: style as PathOptions | StyleFunction,
      onEachFeature: (feature, layer) => {
        if (feature.properties && feature.properties.name) {
          layer.bindPopup(feature.properties.name);
        }

        if (!markSwitcher) {
          layer.on({
            mouseover: createHighlightFeature(map),
            mouseout: createResetHighlight(map),
            click: createZoomToFeature(map)
          });
        }
      }
    });

    map.addLayer(geoJsonLayer);

    // Update cursor styles based on markSwitcher using L.DomUtil
    const mapContainer = map.getContainer();
    if (markSwitcher) {
      L.DomUtil.addClass(mapContainer, "custom-cursor");
    } else {
      L.DomUtil.removeClass(mapContainer, "custom-cursor");
    }

    return () => {
      map.removeLayer(geoJsonLayer);
    };
  }, [markSwitcher, data, style, map, createHighlightFeature, createResetHighlight, createZoomToFeature]);

  return null;
}