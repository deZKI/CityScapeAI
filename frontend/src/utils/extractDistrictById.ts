import {FeatureCollection, GeoJsonObject} from "geojson";

export const extractDistrictById = (geoData: FeatureCollection, id: string): GeoJsonObject | null => {
  const district = geoData.features.find((feature) => feature.properties?.OKATO === id);

  return district || null;
}