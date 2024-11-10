import * as L from "leaflet";

export type TMarker = {
  position: L.LatLngExpression;
  formData?: {
    name: string;
    description: string;
  };
};