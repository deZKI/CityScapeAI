export type THeatmapData = {
  infrastructure: Infrastructure;
  no_infrastructure: NoInfrastructure;
  boundaries: Boundaries;
  district_field: string;
}

export type Boundaries = {
  type: string;
  features: BoundariesFeature[];
}

export type BoundariesFeature = {
  id: string;
  type: FeatureType;
  properties: PurpleProperties;
  geometry: PurpleGeometry;
}

export type PurpleGeometry = {
  type: PurpleType;
  coordinates: Array<Array<Array<number[]>>>;
}

export enum PurpleType {
  MultiPolygon = "MultiPolygon",
  Polygon = "Polygon",
}

export type PurpleProperties = {
  district:   string;
  NAME_EN:    null | string;
  NAME_RU:    null | string;
  ADMIN_LVL:  string;
  OSM_TYPE:   OsmType;
  OSM_ID:     number;
  ADMIN_L1D:  null;
  ADMIN_L1:   null;
  ADMIN_L2D:  null;
  ADMIN_L2:   null;
  ADMIN_L3D:  null;
  ADMIN_L3:   null;
  ADMIN_L4D:  number;
  ADMIN_L4:   AdminL4;
  ADMIN_L5D:  number | null;
  ADMIN_L5:   AdminL5 | null;
  ADMIN_L6D:  number | null;
  ADMIN_L6:   null | string;
  ADMIN_L7D:  null;
  ADMIN_L7:   null;
  ADMIN_L8D:  null;
  ADMIN_L8:   null;
  ADMIN_L9D:  null;
  ADMIN_L9:   null;
  ADMIN_L10D: null;
  ADMIN_L10:  null;
  oktmo:      string;
  okato:      null | string;
  count?:     number;
}

export enum AdminL4 {
  КалужскаяОбласть = "Калужская область",
  Москва = "Москва",
}

export enum AdminL5 {
  ВосточныйАдминистративныйОкруг = "Восточный административный округ",
  ЗападныйАдминистративныйОкруг = "Западный административный округ",
  ЗеленоградскийАдминистративныйОкруг = "Зеленоградский административный округ",
  НовомосковскийАдминистративныйОкруг = "Новомосковский административный округ",
  СеверныйАдминистративныйОкруг = "Северный административный округ",
  СевероВосточныйАдминистративныйОкруг = "Северо-Восточный административный округ",
  СевероЗападныйАдминистративныйОкруг = "Северо-Западный административный округ",
  ТроицкийАдминистративныйОкруг = "Троицкий административный округ",
  ЦентральныйАдминистративныйОкруг = "Центральный административный округ",
  ЮгоВосточныйАдминистративныйОкруг = "Юго-Восточный административный округ",
  ЮгоЗападныйАдминистративныйОкруг = "Юго-Западный административный округ",
  ЮжныйАдминистративныйОкруг = "Южный административный округ",
}

export enum OsmType {
  Relation = "relation",
}

export enum FeatureType {
  Feature = "Feature",
}

export type Infrastructure = {
  type: string;
  features: InfrastructureFeature[];
}

export type InfrastructureFeature = {
  id: string;
  type: FeatureType;
  properties: FluffyProperties;
  geometry:   FluffyGeometry;
}

export type FluffyGeometry = {
  type: FluffyType;
  coordinates: number[];
}

export enum FluffyType {
  Point = "Point",
}

export type FluffyProperties = {
  type: PropertiesType;
}

export enum PropertiesType {
  School = "school",
  TransportStop = "transport_stop",
}

export type NoInfrastructure = {
  type: string;
  features: NoInfrastructureFeature[];
}

export type NoInfrastructureFeature = {
  id: string;
  type: FeatureType;
  properties: PurpleProperties;
  geometry: TentacledGeometry;
}

export type TentacledGeometry = {
  type: PurpleType;
  coordinates: Array<Array<Array<number[] | number>>>;
}