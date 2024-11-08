export type TGeoData = {
  type: string;
  features: TFeature[];
}

export type TFeature = {
  type: string;
  properties: TProperties;
  geometry: TGeometry;
}

export type TProperties = {
  NAME: string;
  OKATO: string;
  OKTMO: string;
  NAME_AO: string;
  OKATO_AO: string;
  ABBREV_AO: string;
  TYPE_MO: string;
  COLOR: string;
}

export type TGeometry = {
  type: string;
  coordinates: number[][][];
}