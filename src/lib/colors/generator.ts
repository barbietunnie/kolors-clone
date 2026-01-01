import chroma from 'chroma-js';
import type { Color } from '@/types/color';
import { createColorFromHex, generateId } from './conversions';

/**
 * Generate a random hex color
 */
export function randomHex(): string {
  return chroma.random().hex().toUpperCase();
}

/**
 * Generate a random color object
 */
export function randomColor(isLocked = false): Color {
  return createColorFromHex(randomHex(), isLocked);
}

/**
 * Generate a palette with random colors
 */
export function generateRandomPalette(count = 5): Color[] {
  return Array.from({ length: count }, () => randomColor());
}

/**
 * Generate a harmonious palette using different color schemes
 */
export function generateHarmoniousPalette(count = 5): Color[] {
  const baseHue = Math.random() * 360;
  const scheme = Math.floor(Math.random() * 4);

  switch (scheme) {
    case 0:
      return generateAnalogousPalette(baseHue, count);
    case 1:
      return generateComplementaryPalette(baseHue, count);
    case 2:
      return generateTriadicPalette(baseHue, count);
    case 3:
      return generateSplitComplementaryPalette(baseHue, count);
    default:
      return generateRandomPalette(count);
  }
}

/**
 * Generate an analogous color palette
 * Colors that are next to each other on the color wheel
 */
export function generateAnalogousPalette(baseHue: number, count = 5): Color[] {
  const colors: Color[] = [];
  const hueStep = 30; // 30 degrees apart
  const startHue = baseHue - ((count - 1) / 2) * hueStep;

  for (let i = 0; i < count; i++) {
    const hue = (startHue + i * hueStep + 360) % 360;
    const saturation = 0.5 + Math.random() * 0.4; // 50-90%
    const lightness = 0.4 + Math.random() * 0.3; // 40-70%
    const hex = chroma.hsl(hue, saturation, lightness).hex().toUpperCase();
    colors.push(createColorFromHex(hex));
  }

  return colors;
}

/**
 * Generate a complementary color palette
 * Uses colors from opposite sides of the color wheel
 */
export function generateComplementaryPalette(baseHue: number, count = 5): Color[] {
  const colors: Color[] = [];
  const complementHue = (baseHue + 180) % 360;

  for (let i = 0; i < count; i++) {
    // Alternate between base hue and complement with slight variations
    const hue = i % 2 === 0
      ? (baseHue + (Math.random() - 0.5) * 20 + 360) % 360
      : (complementHue + (Math.random() - 0.5) * 20 + 360) % 360;
    const saturation = 0.5 + Math.random() * 0.4;
    const lightness = 0.35 + Math.random() * 0.4;
    const hex = chroma.hsl(hue, saturation, lightness).hex().toUpperCase();
    colors.push(createColorFromHex(hex));
  }

  return colors;
}

/**
 * Generate a triadic color palette
 * Uses three colors equally spaced on the color wheel
 */
export function generateTriadicPalette(baseHue: number, count = 5): Color[] {
  const colors: Color[] = [];
  const hues = [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360];

  for (let i = 0; i < count; i++) {
    const hue = hues[i % 3] + (Math.random() - 0.5) * 15;
    const saturation = 0.5 + Math.random() * 0.4;
    const lightness = 0.35 + Math.random() * 0.4;
    const hex = chroma.hsl(hue, saturation, lightness).hex().toUpperCase();
    colors.push(createColorFromHex(hex));
  }

  return colors;
}

/**
 * Generate a split-complementary color palette
 */
export function generateSplitComplementaryPalette(baseHue: number, count = 5): Color[] {
  const colors: Color[] = [];
  const hues = [
    baseHue,
    (baseHue + 150) % 360,
    (baseHue + 210) % 360,
  ];

  for (let i = 0; i < count; i++) {
    const hue = hues[i % 3] + (Math.random() - 0.5) * 15;
    const saturation = 0.5 + Math.random() * 0.4;
    const lightness = 0.35 + Math.random() * 0.4;
    const hex = chroma.hsl(hue, saturation, lightness).hex().toUpperCase();
    colors.push(createColorFromHex(hex));
  }

  return colors;
}

/**
 * Regenerate colors in a palette, keeping locked colors
 */
export function regeneratePalette(currentColors: Color[]): Color[] {
  // Get indices of locked colors
  const lockedIndices = currentColors
    .map((c, i) => (c.isLocked ? i : -1))
    .filter(i => i !== -1);

  // If no colors are locked, generate a completely new harmonious palette
  if (lockedIndices.length === 0) {
    return generateHarmoniousPalette(currentColors.length);
  }

  // If all colors are locked, return current colors
  if (lockedIndices.length === currentColors.length) {
    return currentColors;
  }

  // Generate new colors for unlocked positions
  // Try to make them harmonious with locked colors
  const lockedColors = lockedIndices.map(i => currentColors[i]);
  const avgHue = lockedColors.reduce((sum, c) => sum + c.hsl.h, 0) / lockedColors.length;

  return currentColors.map((color, index) => {
    if (color.isLocked) {
      return color;
    }

    // Generate a new color that's somewhat harmonious with locked colors
    const hueVariation = (Math.random() - 0.5) * 120;
    const newHue = (avgHue + hueVariation + 360) % 360;
    const saturation = 0.5 + Math.random() * 0.4;
    const lightness = 0.35 + Math.random() * 0.4;
    const hex = chroma.hsl(newHue, saturation, lightness).hex().toUpperCase();

    return createColorFromHex(hex);
  });
}

/**
 * Parse a palette from URL (comma-separated hex values)
 */
export function parsePaletteFromUrl(colorsString: string): Color[] {
  const hexValues = colorsString.split('-').filter(Boolean);
  return hexValues.map(hex => createColorFromHex(hex));
}

/**
 * Convert a palette to URL-friendly string
 */
export function paletteToUrl(colors: Color[]): string {
  return colors.map(c => c.hex.replace('#', '')).join('-');
}
