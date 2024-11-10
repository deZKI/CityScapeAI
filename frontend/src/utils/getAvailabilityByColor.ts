import { EAvailability } from "../types/enums/EAvailability.enum";

const rgbToXyz = ({ r, g, b }: { r: number; g: number; b: number }) => {
  r = r / 255;
  g = g / 255;
  b = b / 255;

  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  r *= 100;
  g *= 100;
  b *= 100;

  return {
    x: r * 0.4124 + g * 0.3576 + b * 0.1805,
    y: r * 0.2126 + g * 0.7152 + b * 0.0722,
    z: r * 0.0193 + g * 0.1192 + b * 0.9505,
  };
};

const xyzToLab = ({ x, y, z }: { x: number; y: number; z: number }) => {
  x /= 95.047;
  y /= 100.0;
  z /= 108.883;

  x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116;
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116;
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116;

  return {
    l: (116 * y) - 16,
    a: 500 * (x - y),
    b: 200 * (y - z),
  };
};

const deltaE = (lab1: { l: number; a: number; b: number }, lab2: { l: number; a: number; b: number }): number => {
  const { l: l1, a: a1, b: b1 } = lab1;
  const { l: l2, a: a2, b: b2 } = lab2;

  const deltaL = l2 - l1;
  const deltaA = a2 - a1;
  const deltaB = b2 - b1;

  const c1 = Math.sqrt(a1 * a1 + b1 * b1);
  const c2 = Math.sqrt(a2 * a2 + b2 * b2);
  const deltaC = c2 - c1;

  const deltaH = Math.sqrt(deltaA * deltaA + deltaB * deltaB - deltaC * deltaC);
  const sl = 1;
  const sc = 1 + 0.045 * c1;
  const sh = 1 + 0.015 * c1;

  return Math.sqrt(
    (deltaL / sl) * (deltaL / sl) +
    (deltaC / sc) * (deltaC / sc) +
    (deltaH / sh) * (deltaH / sh)
  );
};

export const getAvailabilityByColor = (color: string): EAvailability => {
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const bigint = parseInt(hex.slice(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };

  const rgbStringToRgb = (rgbString: string): { r: number; g: number; b: number } => {
    const match = rgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) {
      return { r: 0, g: 0, b: 0 };
    }
    return {
      r: parseInt(match[1], 10),
      g: parseInt(match[2], 10),
      b: parseInt(match[3], 10),
    };
  };

  const getColorVariable = (varName: string): string =>
    getComputedStyle(document.documentElement).getPropertyValue(varName).trim();

  const lowAvailabilityColor = hexToRgb(getColorVariable('--low-availability-background'));
  const mediumAvailabilityColor = hexToRgb(getColorVariable('--medium-availability-background'));
  const highAvailabilityColor = hexToRgb(getColorVariable('--high-availability-background'));
  const inputColor = rgbStringToRgb(color);

  const lowLab = xyzToLab(rgbToXyz(lowAvailabilityColor));
  const mediumLab = xyzToLab(rgbToXyz(mediumAvailabilityColor));
  const highLab = xyzToLab(rgbToXyz(highAvailabilityColor));
  const inputLab = xyzToLab(rgbToXyz(inputColor));

  const distances = {
    'low': deltaE(inputLab, lowLab),
    'medium': deltaE(inputLab, mediumLab),
    'high': deltaE(inputLab, highLab),
  };

  const closest = Object.entries(distances).reduce((prev, curr) => (curr[1] < prev[1] ? curr : prev))[0];

  return closest as EAvailability;
};
