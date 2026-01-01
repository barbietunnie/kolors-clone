import chroma from 'chroma-js';

export interface HarmonyResult {
  name: string;
  colors: string[];
  description: string;
}

/**
 * Get complementary color (opposite on color wheel)
 */
export function getComplementary(hex: string): HarmonyResult {
  const hsl = chroma(hex).hsl();
  const complementHue = (hsl[0] + 180) % 360;
  const complement = chroma.hsl(complementHue, hsl[1], hsl[2]).hex().toUpperCase();

  return {
    name: 'Complementary',
    colors: [hex.toUpperCase(), complement],
    description: 'Two colors opposite on the color wheel. High contrast and vibrant.',
  };
}

/**
 * Get analogous colors (adjacent on color wheel)
 */
export function getAnalogous(hex: string): HarmonyResult {
  const hsl = chroma(hex).hsl();
  const colors = [-30, 0, 30].map((offset) => {
    const hue = (hsl[0] + offset + 360) % 360;
    return chroma.hsl(hue, hsl[1], hsl[2]).hex().toUpperCase();
  });

  return {
    name: 'Analogous',
    colors,
    description: 'Three colors next to each other on the wheel. Harmonious and serene.',
  };
}

/**
 * Get triadic colors (three equally spaced)
 */
export function getTriadic(hex: string): HarmonyResult {
  const hsl = chroma(hex).hsl();
  const colors = [0, 120, 240].map((offset) => {
    const hue = (hsl[0] + offset) % 360;
    return chroma.hsl(hue, hsl[1], hsl[2]).hex().toUpperCase();
  });

  return {
    name: 'Triadic',
    colors,
    description: 'Three colors equally spaced. Vibrant and balanced.',
  };
}

/**
 * Get split-complementary colors
 */
export function getSplitComplementary(hex: string): HarmonyResult {
  const hsl = chroma(hex).hsl();
  const colors = [0, 150, 210].map((offset) => {
    const hue = (hsl[0] + offset) % 360;
    return chroma.hsl(hue, hsl[1], hsl[2]).hex().toUpperCase();
  });

  return {
    name: 'Split Complementary',
    colors,
    description: 'Base color plus two adjacent to its complement. Less tension than complementary.',
  };
}

/**
 * Get tetradic/rectangle colors
 */
export function getTetradic(hex: string): HarmonyResult {
  const hsl = chroma(hex).hsl();
  const colors = [0, 60, 180, 240].map((offset) => {
    const hue = (hsl[0] + offset) % 360;
    return chroma.hsl(hue, hsl[1], hsl[2]).hex().toUpperCase();
  });

  return {
    name: 'Tetradic',
    colors,
    description: 'Four colors forming a rectangle. Rich and versatile.',
  };
}

/**
 * Get square colors (four equally spaced)
 */
export function getSquare(hex: string): HarmonyResult {
  const hsl = chroma(hex).hsl();
  const colors = [0, 90, 180, 270].map((offset) => {
    const hue = (hsl[0] + offset) % 360;
    return chroma.hsl(hue, hsl[1], hsl[2]).hex().toUpperCase();
  });

  return {
    name: 'Square',
    colors,
    description: 'Four colors equally spaced. Bold and dynamic.',
  };
}

/**
 * Get all harmonies for a color
 */
export function getAllHarmonies(hex: string): HarmonyResult[] {
  return [
    getComplementary(hex),
    getAnalogous(hex),
    getTriadic(hex),
    getSplitComplementary(hex),
    getTetradic(hex),
    getSquare(hex),
  ];
}
