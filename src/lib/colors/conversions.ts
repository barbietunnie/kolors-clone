import chroma from 'chroma-js';
import type { RGB, HSL, HSB, CMYK, LAB, Color } from '@/types/color';

/**
 * Generate a unique ID for colors
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Validate and normalize a hex color
 */
export function normalizeHex(hex: string): string {
  // Remove # if present
  let h = hex.replace('#', '');

  // Handle shorthand hex (e.g., "FFF" -> "FFFFFF")
  if (h.length === 3) {
    h = h.split('').map(c => c + c).join('');
  }

  // Validate hex
  if (!/^[0-9A-Fa-f]{6}$/.test(h)) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  return `#${h.toUpperCase()}`;
}

/**
 * Convert HEX to RGB
 */
export function hexToRgb(hex: string): RGB {
  const color = chroma(hex);
  const [r, g, b] = color.rgb();
  return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
}

/**
 * Convert RGB to HEX
 */
export function rgbToHex(rgb: RGB): string {
  return chroma(rgb.r, rgb.g, rgb.b).hex().toUpperCase();
}

/**
 * Convert HEX to HSL
 */
export function hexToHsl(hex: string): HSL {
  const color = chroma(hex);
  const [h, s, l] = color.hsl();
  return {
    h: Math.round(isNaN(h) ? 0 : h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert HSL to HEX
 */
export function hslToHex(hsl: HSL): string {
  return chroma.hsl(hsl.h, hsl.s / 100, hsl.l / 100).hex().toUpperCase();
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(rgb: RGB): HSL {
  const color = chroma(rgb.r, rgb.g, rgb.b);
  const [h, s, l] = color.hsl();
  return {
    h: Math.round(isNaN(h) ? 0 : h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(hsl: HSL): RGB {
  const color = chroma.hsl(hsl.h, hsl.s / 100, hsl.l / 100);
  const [r, g, b] = color.rgb();
  return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
}

/**
 * Convert HEX to HSB (HSV)
 */
export function hexToHsb(hex: string): HSB {
  const color = chroma(hex);
  const [h, s, v] = color.hsv();
  return {
    h: Math.round(isNaN(h) ? 0 : h),
    s: Math.round(s * 100),
    b: Math.round(v * 100),
  };
}

/**
 * Convert HSB to HEX
 */
export function hsbToHex(hsb: HSB): string {
  return chroma.hsv(hsb.h, hsb.s / 100, hsb.b / 100).hex().toUpperCase();
}

/**
 * Convert HEX to CMYK
 */
export function hexToCmyk(hex: string): CMYK {
  const color = chroma(hex);
  const [c, m, y, k] = color.cmyk();
  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100),
  };
}

/**
 * Convert CMYK to HEX
 */
export function cmykToHex(cmyk: CMYK): string {
  return chroma.cmyk(cmyk.c / 100, cmyk.m / 100, cmyk.y / 100, cmyk.k / 100).hex().toUpperCase();
}

/**
 * Convert HEX to LAB
 */
export function hexToLab(hex: string): LAB {
  const color = chroma(hex);
  const [l, a, b] = color.lab();
  return {
    l: Math.round(l),
    a: Math.round(a),
    b: Math.round(b),
  };
}

/**
 * Convert LAB to HEX
 */
export function labToHex(lab: LAB): string {
  return chroma.lab(lab.l, lab.a, lab.b).hex().toUpperCase();
}

/**
 * Create a full Color object from a hex value
 */
export function createColorFromHex(hex: string, isLocked = false): Color {
  const normalizedHex = normalizeHex(hex);
  return {
    id: generateId(),
    hex: normalizedHex,
    rgb: hexToRgb(normalizedHex),
    hsl: hexToHsl(normalizedHex),
    isLocked,
  };
}

/**
 * Get luminance of a color (0-1)
 */
export function getLuminance(hex: string): number {
  return chroma(hex).luminance();
}

/**
 * Determine if text should be light or dark based on background
 */
export function getContrastingTextColor(hex: string): string {
  const luminance = getLuminance(hex);
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/**
 * Lighten a color by a percentage
 */
export function lighten(hex: string, amount: number): string {
  return chroma(hex).brighten(amount).hex().toUpperCase();
}

/**
 * Darken a color by a percentage
 */
export function darken(hex: string, amount: number): string {
  return chroma(hex).darken(amount).hex().toUpperCase();
}

/**
 * Saturate a color by a percentage
 */
export function saturate(hex: string, amount: number): string {
  return chroma(hex).saturate(amount).hex().toUpperCase();
}

/**
 * Desaturate a color by a percentage
 */
export function desaturate(hex: string, amount: number): string {
  return chroma(hex).desaturate(amount).hex().toUpperCase();
}

/**
 * Color family type for classification
 */
export type ColorFamily =
  | 'Red'
  | 'Orange'
  | 'Yellow'
  | 'Green'
  | 'Cyan'
  | 'Blue'
  | 'Purple'
  | 'Pink'
  | 'Brown'
  | 'Grey'
  | 'White'
  | 'Black';

/**
 * Get the color family for a given hex color
 * Uses HSL-based classification similar to Coolors.co
 */
export function getColorFamily(hex: string): ColorFamily {
  try {
    const color = chroma(hex);
    const [h, s, l] = color.hsl();

    // Normalize values (s and l are 0-1, h is 0-360 or NaN for greys)
    const hue = isNaN(h) ? 0 : h;
    const saturation = s * 100; // Convert to percentage
    const lightness = l * 100;  // Convert to percentage

    // Handle achromatic colors first (very low saturation)
    if (saturation <= 5) {
      if (lightness >= 95) return 'White';
      if (lightness <= 8) return 'Black';
      return 'Grey';
    }

    // Handle very light colors
    if (lightness >= 97) return 'White';

    // Handle very dark colors
    if (lightness <= 5) return 'Black';

    // Handle near-grey colors (low saturation)
    if (saturation <= 10) {
      if (lightness >= 85) return 'White';
      if (lightness <= 15) return 'Black';
      return 'Grey';
    }

    // Brown detection: warm hues with low-to-moderate saturation and low-to-moderate lightness
    // Browns are essentially dark/desaturated oranges and reds
    const isWarmHue = (hue >= 0 && hue <= 50) || hue >= 350;
    if (isWarmHue && saturation >= 10 && saturation <= 70 && lightness >= 8 && lightness <= 55) {
      // Additional check: browns typically have specific characteristics
      // Check if it's more brown-like (darker, less saturated warm colors)
      if (lightness <= 45 || (saturation <= 50 && lightness <= 55)) {
        return 'Brown';
      }
    }

    // Chromatic color classification by hue
    // Red: 0-10° and 350-360°
    if (hue >= 350 || hue < 10) {
      // Check if it's a pink-ish red (lighter reds)
      if (lightness >= 60 && saturation <= 60) return 'Pink';
      return 'Red';
    }

    // Orange: 10-40°
    if (hue >= 10 && hue < 40) {
      // Light desaturated oranges might be brown
      if (saturation <= 50 && lightness <= 50) return 'Brown';
      return 'Orange';
    }

    // Yellow: 40-70°
    if (hue >= 40 && hue < 70) {
      // Dark yellows are often brown (like olive, khaki)
      if (lightness <= 45 && saturation <= 60) return 'Brown';
      return 'Yellow';
    }

    // Green: 70-165°
    if (hue >= 70 && hue < 165) {
      return 'Green';
    }

    // Cyan: 165-200°
    if (hue >= 165 && hue < 200) {
      return 'Cyan';
    }

    // Blue: 200-260°
    if (hue >= 200 && hue < 260) {
      return 'Blue';
    }

    // Purple: 260-300°
    if (hue >= 260 && hue < 300) {
      return 'Purple';
    }

    // Pink: 300-350°
    if (hue >= 300 && hue < 350) {
      // Darker pinks with more saturation might be purple/magenta
      if (lightness <= 35 && saturation >= 50) return 'Purple';
      return 'Pink';
    }

    // Fallback (shouldn't reach here)
    return 'Grey';
  } catch {
    return 'Grey';
  }
}

/**
 * Check if a color belongs to a specific family
 */
export function isColorInFamily(hex: string, family: ColorFamily): boolean {
  return getColorFamily(hex) === family;
}
