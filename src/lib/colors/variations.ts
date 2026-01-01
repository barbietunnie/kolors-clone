import chroma from 'chroma-js';

export interface ColorVariation {
  hex: string;
  percentage: number;
}

/**
 * Generate shades (adding black)
 */
export function getShades(hex: string, count = 9): ColorVariation[] {
  const variations: ColorVariation[] = [];

  for (let i = 0; i < count; i++) {
    const percentage = (i / (count - 1)) * 100;
    const shade = chroma.mix(hex, '#000000', i / (count - 1)).hex().toUpperCase();
    variations.push({ hex: shade, percentage: Math.round(percentage) });
  }

  return variations;
}

/**
 * Generate tints (adding white)
 */
export function getTints(hex: string, count = 9): ColorVariation[] {
  const variations: ColorVariation[] = [];

  for (let i = 0; i < count; i++) {
    const percentage = (i / (count - 1)) * 100;
    const tint = chroma.mix(hex, '#FFFFFF', i / (count - 1)).hex().toUpperCase();
    variations.push({ hex: tint, percentage: Math.round(percentage) });
  }

  return variations;
}

/**
 * Generate tones (adding gray)
 */
export function getTones(hex: string, count = 9): ColorVariation[] {
  const variations: ColorVariation[] = [];

  for (let i = 0; i < count; i++) {
    const percentage = (i / (count - 1)) * 100;
    const tone = chroma.mix(hex, '#808080', i / (count - 1)).hex().toUpperCase();
    variations.push({ hex: tone, percentage: Math.round(percentage) });
  }

  return variations;
}

/**
 * Generate hue variations
 */
export function getHueVariations(hex: string, count = 12): ColorVariation[] {
  const variations: ColorVariation[] = [];
  const hsl = chroma(hex).hsl();

  for (let i = 0; i < count; i++) {
    const hueShift = (i / count) * 360;
    const newHue = (hsl[0] + hueShift) % 360;
    const variation = chroma.hsl(newHue, hsl[1], hsl[2]).hex().toUpperCase();
    variations.push({ hex: variation, percentage: Math.round(hueShift) });
  }

  return variations;
}

/**
 * Generate saturation variations
 */
export function getSaturationVariations(hex: string, count = 9): ColorVariation[] {
  const variations: ColorVariation[] = [];
  const hsl = chroma(hex).hsl();

  for (let i = 0; i < count; i++) {
    const saturation = i / (count - 1);
    const variation = chroma.hsl(hsl[0] || 0, saturation, hsl[2]).hex().toUpperCase();
    variations.push({ hex: variation, percentage: Math.round(saturation * 100) });
  }

  return variations;
}

/**
 * Generate brightness/lightness variations
 */
export function getBrightnessVariations(hex: string, count = 9): ColorVariation[] {
  const variations: ColorVariation[] = [];
  const hsl = chroma(hex).hsl();

  for (let i = 0; i < count; i++) {
    const lightness = (i / (count - 1)) * 0.9 + 0.05; // Keep between 5% and 95%
    const variation = chroma.hsl(hsl[0] || 0, hsl[1], lightness).hex().toUpperCase();
    variations.push({ hex: variation, percentage: Math.round(lightness * 100) });
  }

  return variations;
}
