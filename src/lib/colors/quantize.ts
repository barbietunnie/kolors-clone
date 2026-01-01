import type { RGB } from '@/types/color';

/**
 * Median Cut Color Quantization Algorithm
 * Extracts dominant colors from image data
 */

interface ColorBox {
  colors: RGB[];
  min: RGB;
  max: RGB;
}

/**
 * Get the channel with the largest range in a color box
 */
function getLargestRangeChannel(box: ColorBox): 'r' | 'g' | 'b' {
  const rRange = box.max.r - box.min.r;
  const gRange = box.max.g - box.min.g;
  const bRange = box.max.b - box.min.b;

  if (rRange >= gRange && rRange >= bRange) return 'r';
  if (gRange >= rRange && gRange >= bRange) return 'g';
  return 'b';
}

/**
 * Calculate the bounding box of colors
 */
function getBoundingBox(colors: RGB[]): { min: RGB; max: RGB } {
  let minR = 255, maxR = 0;
  let minG = 255, maxG = 0;
  let minB = 255, maxB = 0;

  for (const color of colors) {
    minR = Math.min(minR, color.r);
    maxR = Math.max(maxR, color.r);
    minG = Math.min(minG, color.g);
    maxG = Math.max(maxG, color.g);
    minB = Math.min(minB, color.b);
    maxB = Math.max(maxB, color.b);
  }

  return {
    min: { r: minR, g: minG, b: minB },
    max: { r: maxR, g: maxG, b: maxB },
  };
}

/**
 * Calculate the average color of a box
 */
function getAverageColor(colors: RGB[]): RGB {
  if (colors.length === 0) return { r: 0, g: 0, b: 0 };

  let totalR = 0, totalG = 0, totalB = 0;

  for (const color of colors) {
    totalR += color.r;
    totalG += color.g;
    totalB += color.b;
  }

  return {
    r: Math.round(totalR / colors.length),
    g: Math.round(totalG / colors.length),
    b: Math.round(totalB / colors.length),
  };
}

/**
 * Split a color box at the median of its largest range channel
 */
function splitBox(box: ColorBox): [ColorBox, ColorBox] {
  const channel = getLargestRangeChannel(box);

  // Sort by the channel with largest range
  const sorted = [...box.colors].sort((a, b) => a[channel] - b[channel]);

  const medianIndex = Math.floor(sorted.length / 2);
  const colors1 = sorted.slice(0, medianIndex);
  const colors2 = sorted.slice(medianIndex);

  const bounds1 = getBoundingBox(colors1);
  const bounds2 = getBoundingBox(colors2);

  return [
    { colors: colors1, ...bounds1 },
    { colors: colors2, ...bounds2 },
  ];
}

/**
 * Get the volume of a color box
 */
function getBoxVolume(box: ColorBox): number {
  return (box.max.r - box.min.r + 1) *
         (box.max.g - box.min.g + 1) *
         (box.max.b - box.min.b + 1);
}

/**
 * Calculate color distance for deduplication
 */
function colorDistance(c1: RGB, c2: RGB): number {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
    Math.pow(c1.g - c2.g, 2) +
    Math.pow(c1.b - c2.b, 2)
  );
}

/**
 * Check if a color is too close to any in the array
 */
function isTooClose(color: RGB, colors: RGB[], threshold: number = 30): boolean {
  return colors.some(c => colorDistance(color, c) < threshold);
}

/**
 * Calculate color vibrancy (saturation-like metric)
 */
function getVibrancy(color: RGB): number {
  const max = Math.max(color.r, color.g, color.b);
  const min = Math.min(color.r, color.g, color.b);
  if (max === 0) return 0;
  return (max - min) / max;
}

/**
 * Sort colors by visual appeal (vibrancy + spread)
 */
function sortByAppeal(colors: RGB[]): RGB[] {
  return [...colors].sort((a, b) => {
    // Calculate vibrancy
    const vibA = getVibrancy(a);
    const vibB = getVibrancy(b);

    // Calculate lightness
    const lightA = (a.r + a.g + a.b) / 3 / 255;
    const lightB = (b.r + b.g + b.b) / 3 / 255;

    // Prefer vibrant colors, avoid extremely dark or light
    const scoreA = vibA * 0.6 + Math.abs(lightA - 0.5) * -0.4;
    const scoreB = vibB * 0.6 + Math.abs(lightB - 0.5) * -0.4;

    return scoreB - scoreA;
  });
}

/**
 * Extract dominant colors from image data using median cut algorithm
 * @param imageData - ImageData from canvas
 * @param colorCount - Number of colors to extract (2-10)
 * @returns Array of RGB colors
 */
export function extractColorsFromImage(imageData: ImageData, colorCount: number = 5): RGB[] {
  const { data, width, height } = imageData;
  const colors: RGB[] = [];

  // Sample pixels (skip some for performance on large images)
  const pixelCount = width * height;
  const sampleRate = pixelCount > 100000 ? Math.floor(pixelCount / 50000) : 1;

  for (let i = 0; i < data.length; i += 4 * sampleRate) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    // Skip transparent or near-white/black pixels
    if (a < 128) continue;

    // Skip near-white pixels
    if (r > 250 && g > 250 && b > 250) continue;

    // Skip near-black pixels
    if (r < 5 && g < 5 && b < 5) continue;

    colors.push({ r, g, b });
  }

  if (colors.length === 0) {
    // Return default colors if no valid pixels found
    return Array.from({ length: colorCount }, () => ({ r: 128, g: 128, b: 128 }));
  }

  // Initialize with one box containing all colors
  const bounds = getBoundingBox(colors);
  const boxes: ColorBox[] = [{ colors, ...bounds }];

  // Split until we have enough boxes
  // We want more boxes than colorCount to allow filtering
  const targetBoxes = Math.min(colorCount * 3, 30);

  while (boxes.length < targetBoxes) {
    // Find the box with the largest volume that has enough colors to split
    let maxVolume = 0;
    let maxIndex = -1;

    for (let i = 0; i < boxes.length; i++) {
      if (boxes[i].colors.length < 2) continue;
      const volume = getBoxVolume(boxes[i]);
      if (volume > maxVolume) {
        maxVolume = volume;
        maxIndex = i;
      }
    }

    if (maxIndex === -1) break;

    // Split the box
    const box = boxes.splice(maxIndex, 1)[0];
    const [box1, box2] = splitBox(box);

    if (box1.colors.length > 0) boxes.push(box1);
    if (box2.colors.length > 0) boxes.push(box2);
  }

  // Get average color from each box, weighted by pixel count
  let extractedColors = boxes
    .filter(box => box.colors.length > 0)
    .map(box => ({
      color: getAverageColor(box.colors),
      weight: box.colors.length,
    }))
    .sort((a, b) => b.weight - a.weight)
    .map(item => item.color);

  // Sort by visual appeal
  extractedColors = sortByAppeal(extractedColors);

  // Remove similar colors and select the desired count
  const finalColors: RGB[] = [];

  for (const color of extractedColors) {
    if (finalColors.length >= colorCount) break;
    if (!isTooClose(color, finalColors, 25)) {
      finalColors.push(color);
    }
  }

  // If we don't have enough, add more with a lower threshold
  if (finalColors.length < colorCount) {
    for (const color of extractedColors) {
      if (finalColors.length >= colorCount) break;
      if (!isTooClose(color, finalColors, 15)) {
        finalColors.push(color);
      }
    }
  }

  // If still not enough, just add remaining
  if (finalColors.length < colorCount) {
    for (const color of extractedColors) {
      if (finalColors.length >= colorCount) break;
      if (!finalColors.includes(color)) {
        finalColors.push(color);
      }
    }
  }

  return finalColors.slice(0, colorCount);
}

/**
 * Get color at specific pixel coordinates
 */
export function getColorAtPixel(imageData: ImageData, x: number, y: number): RGB {
  const { data, width } = imageData;
  const index = (y * width + x) * 4;

  return {
    r: data[index],
    g: data[index + 1],
    b: data[index + 2],
  };
}

/**
 * Convert RGB to hex string
 */
export function rgbToHexString(rgb: RGB): string {
  const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}
