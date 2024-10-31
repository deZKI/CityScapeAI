import {TCoverageTypes} from "./coverageTypes";
import {TPoints} from "./points.type";

export type TCSVData = {
  hash: string;
  points: TPoints[];
  prediction: number;
  ageFrom: number;
  ageTo: number;
  income: string;
  name: string;
  gender: string;
  description: string;
  type: TCoverageTypes;
}
