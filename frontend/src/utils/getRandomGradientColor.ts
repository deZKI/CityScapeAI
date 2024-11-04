type RGB = { r: number; g: number; b: number };

function hexToRgb(hex: string): RGB {
  const bigint = parseInt(hex.slice(1), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

const interpolateColor = (color1: RGB, color2: RGB, factor: number): RGB => {
  return {
    r: Math.round(color1.r + (color2.r - color1.r) * factor),
    g: Math.round(color1.g + (color2.g - color1.g) * factor),
    b: Math.round(color1.b + (color2.b - color1.b) * factor),
  };
}

export const getRandomGradientColor = (): string => {
  const gradient = [
    { color: hexToRgb("#D94141"), position: 0 },
    { color: hexToRgb("#D9D941"), position: 0.5 },
    { color: hexToRgb("#56D941"), position: 1 },
  ];

  const t = Math.random();
  const color1 = gradient.find((stop) => stop.position <= t);
  const color2 = gradient.find((stop) => stop.position > t) || color1;
  const factor = (t - color1!.position) / (color2!.position - color1!.position);
  const interpolatedColor = interpolateColor(color1!.color, color2!.color, factor);

  return `rgb(${interpolatedColor.r}, ${interpolatedColor.g}, ${interpolatedColor.b})`;
}