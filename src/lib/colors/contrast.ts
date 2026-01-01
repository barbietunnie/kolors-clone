import chroma from 'chroma-js';

export interface ContrastResult {
  ratio: number;
  aa: {
    normal: boolean;
    large: boolean;
  };
  aaa: {
    normal: boolean;
    large: boolean;
  };
}

/**
 * Calculate contrast ratio between two colors
 * Based on WCAG 2.0 formula
 */
export function getContrastRatio(color1: string, color2: string): number {
  return chroma.contrast(color1, color2);
}

/**
 * Check if contrast ratio meets WCAG requirements
 */
export function checkContrast(foreground: string, background: string): ContrastResult {
  const ratio = getContrastRatio(foreground, background);

  return {
    ratio: Math.round(ratio * 100) / 100,
    aa: {
      normal: ratio >= 4.5,  // WCAG AA for normal text
      large: ratio >= 3,     // WCAG AA for large text (18pt or 14pt bold)
    },
    aaa: {
      normal: ratio >= 7,    // WCAG AAA for normal text
      large: ratio >= 4.5,   // WCAG AAA for large text
    },
  };
}

/**
 * Get a WCAG rating string
 */
export function getContrastRating(ratio: number): string {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Fail';
}

/**
 * Suggest an accessible alternative color
 * Adjusts lightness to meet target contrast ratio
 */
export function suggestAccessibleColor(
  colorToAdjust: string,
  fixedColor: string,
  targetRatio = 4.5
): string {
  const currentRatio = getContrastRatio(colorToAdjust, fixedColor);

  if (currentRatio >= targetRatio) {
    return colorToAdjust;
  }

  const fixedLuminance = chroma(fixedColor).luminance();
  let adjusted = chroma(colorToAdjust);

  // Determine if we should lighten or darken
  const shouldLighten = fixedLuminance < 0.5;

  // Binary search for the right lightness
  let low = 0;
  let high = 1;
  let bestColor = colorToAdjust;
  let bestRatio = currentRatio;

  for (let i = 0; i < 20; i++) {
    const mid = (low + high) / 2;
    const testColor = shouldLighten
      ? adjusted.luminance(mid + 0.01)
      : adjusted.luminance(Math.max(0, fixedLuminance - mid));

    const testRatio = getContrastRatio(testColor.hex(), fixedColor);

    if (testRatio >= targetRatio && testRatio > bestRatio) {
      bestColor = testColor.hex();
      bestRatio = testRatio;
      high = mid;
    } else {
      low = mid;
    }
  }

  return bestColor.toUpperCase();
}
