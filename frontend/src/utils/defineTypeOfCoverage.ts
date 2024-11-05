import { TCoverageTypes } from "../types/types/TCoverage.type";

export const defineTypeOfCoverage = (type: TCoverageTypes): string => {
  const typeTextMap = {
    high: "Высокий",
    middle: "Средний",
    low: "Низкий"
  };

  return typeTextMap[type];
}
