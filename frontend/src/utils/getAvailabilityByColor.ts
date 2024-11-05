import {EAvailability} from "../types/enums/EAvailability.enum";

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const bigint = parseInt(hex.replace('#', ''), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

const getColorVariable = (varName: string): string => {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

const colorDistance = (color1: { r: number; g: number; b: number }, color2: { r: number; g: number; b: number }): number => {
  return Math.sqrt(
    Math.pow(color1.r - color2.r, 2) +
    Math.pow(color1.g - color2.g, 2) +
    Math.pow(color1.b - color2.b, 2)
  );
}

const getAvailabilityByColor = (color: string): EAvailability => {
  const lowAvailabilityColor = hexToRgb(getColorVariable('--low-availability-background'));
  const mediumAvailabilityColor = hexToRgb(getColorVariable('--medium-availability-background'));
  const highAvailabilityColor = hexToRgb(getColorVariable('--high-availability-background'));
  const inputColor = hexToRgb(color);

  const distances = {
    'low': colorDistance(inputColor, lowAvailabilityColor),
    'medium': colorDistance(inputColor, mediumAvailabilityColor),
    'high': colorDistance(inputColor, highAvailabilityColor),
  };

  const closest = Object.entries(distances).reduce((prev, curr) => (curr[1] < prev[1] ? curr : prev))[0];

  return closest as EAvailability;
}