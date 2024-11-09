import React from "react";
import {LeafletMouseEventHandlerFn, PathOptions, StyleFunction} from "leaflet";
import {GeoJSON, GeoJSONProps, useMap} from "react-leaflet";
import {GeoJsonObject} from "geojson";
import * as L from "leaflet";

type TProps = {
  data: GeoJsonObject;
  style: PathOptions | StyleFunction | undefined;
  createHighlightFeature: (map: L.Map) => LeafletMouseEventHandlerFn | undefined;
  createResetHighlight: (map: L.Map) => LeafletMouseEventHandlerFn | undefined;
  createZoomToFeature: (map: L.Map) => LeafletMouseEventHandlerFn | undefined;
};

export default function PolygonsLayer({ data, style, createHighlightFeature, createResetHighlight, createZoomToFeature }: TProps) {
  const map = useMap();

  const onEachFeature: GeoJSONProps['onEachFeature'] = (feature, layer) => {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(feature.properties.name);
    }

    layer.on({
      mouseover: createHighlightFeature(map),
      mouseout: createResetHighlight(map),
      click: createZoomToFeature(map)
    });
  };

  return <GeoJSON data={data} style={style} onEachFeature={onEachFeature} />;
}