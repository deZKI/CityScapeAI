import { RGB } from "../types/types/TRGB.type";

const hexToRgb = (hex: string): RGB => {
  const bigint = parseInt(hex.slice(1), 16);

  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

const interpolateColor = (color1: RGB, color2: RGB, factor: number): RGB => {
  return {
    r: Math.round(color1.r + (color2.r - color1.r) * factor),
    g: Math.round(color1.g + (color2.g - color1.g) * factor),
    b: Math.round(color1.b + (color2.b - color1.b) * factor),
  };
};

export const getDensityColor = (load: number, minLoad: number, maxLoad: number): string => {
  const lowColor = hexToRgb("#56D941");
  const mediumColor = hexToRgb("#D9D941");
  const highColor = hexToRgb("#D94141");

  if (minLoad === maxLoad) {
    return `rgb(${lowColor.r}, ${lowColor.g}, ${lowColor.b})`;
  }

  const factor = (load - minLoad) / (maxLoad - minLoad);

  let interpolatedColor: RGB;

  if (factor <= 0.5) {
    interpolatedColor = interpolateColor(lowColor, mediumColor, factor * 2);
  } else {
    interpolatedColor = interpolateColor(mediumColor, highColor, (factor - 0.5) * 2);
  }

  return `rgb(${interpolatedColor.r}, ${interpolatedColor.g}, ${interpolatedColor.b})`;
};

// // @ts-ignore
// import * as d3 from 'd3-scale';
//
// export const getDensityColor = (load: number, minLoad: number, maxLoad: number): string => {
//   const colorScale = d3.scaleLinear<string>()
//     .domain([minLoad, (minLoad + maxLoad) / 2, maxLoad])
//     .range(["#56D941", "#D9D941", "#D94141"]);
//
//   return colorScale(load);
// };
