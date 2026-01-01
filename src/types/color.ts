export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface HSB {
  h: number;
  s: number;
  b: number;
}

export interface CMYK {
  c: number;
  m: number;
  y: number;
  k: number;
}

export interface LAB {
  l: number;
  a: number;
  b: number;
}

export interface Color {
  id: string;
  hex: string;
  rgb: RGB;
  hsl: HSL;
  isLocked: boolean;
}

export interface Palette {
  id: string;
  colors: Color[];
  name?: string;
  tags?: string[];
  createdAt: Date;
}

export type HarmonyType =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split-complementary'
  | 'tetradic'
  | 'square';

export type ColorBlindnessType =
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'
  | 'achromatopsia';
