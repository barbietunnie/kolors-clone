import chroma from 'chroma-js';

export type ColorBlindnessType =
  | 'protanopia'    // Red-blind
  | 'deuteranopia'  // Green-blind
  | 'tritanopia'    // Blue-blind
  | 'achromatopsia'; // Total color blindness

export interface BlindnessSimulation {
  type: ColorBlindnessType;
  name: string;
  description: string;
  simulatedColor: string;
}

// Color blindness simulation matrices
// Based on research by Machado, Oliveira and Fernandes (2009)
const matrices: Record<ColorBlindnessType, number[][]> = {
  protanopia: [
    [0.567, 0.433, 0],
    [0.558, 0.442, 0],
    [0, 0.242, 0.758],
  ],
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7],
  ],
  tritanopia: [
    [0.95, 0.05, 0],
    [0, 0.433, 0.567],
    [0, 0.475, 0.525],
  ],
  achromatopsia: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
  ],
};

const descriptions: Record<ColorBlindnessType, { name: string; description: string }> = {
  protanopia: {
    name: 'Protanopia',
    description: 'Red-blind. Difficulty distinguishing red and green colors.',
  },
  deuteranopia: {
    name: 'Deuteranopia',
    description: 'Green-blind. Most common form, affects red-green perception.',
  },
  tritanopia: {
    name: 'Tritanopia',
    description: 'Blue-blind. Rare condition affecting blue-yellow perception.',
  },
  achromatopsia: {
    name: 'Achromatopsia',
    description: 'Complete color blindness. Sees only in grayscale.',
  },
};

/**
 * Simulate how a color appears to someone with color blindness
 */
export function simulateColorBlindness(hex: string, type: ColorBlindnessType): string {
  const rgb = chroma(hex).rgb();
  const matrix = matrices[type];

  const r = Math.round(rgb[0] * matrix[0][0] + rgb[1] * matrix[0][1] + rgb[2] * matrix[0][2]);
  const g = Math.round(rgb[0] * matrix[1][0] + rgb[1] * matrix[1][1] + rgb[2] * matrix[1][2]);
  const b = Math.round(rgb[0] * matrix[2][0] + rgb[1] * matrix[2][1] + rgb[2] * matrix[2][2]);

  return chroma(
    Math.min(255, Math.max(0, r)),
    Math.min(255, Math.max(0, g)),
    Math.min(255, Math.max(0, b))
  ).hex().toUpperCase();
}

/**
 * Get all color blindness simulations for a color
 */
export function getAllBlindnessSimulations(hex: string): BlindnessSimulation[] {
  const types: ColorBlindnessType[] = ['protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia'];

  return types.map((type) => ({
    type,
    name: descriptions[type].name,
    description: descriptions[type].description,
    simulatedColor: simulateColorBlindness(hex, type),
  }));
}
