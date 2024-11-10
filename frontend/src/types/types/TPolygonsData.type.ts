type PeopleDistribution = {
  children_and_pensioners: number;
  adults_private_transport: number;
  adults_public_transport: number;
  adults_carsharing_SIM: number;
};

export type TPolygonsData = {
  district: string;
  load_people: number;
  people_distribution: PeopleDistribution;
  geometry: any | null;
};