/**
 * Trending palettes data loader
 * @author Babatunde Adeyemi
 */

import type { SeedPalette } from './palettes';
import trendingData from './trending-palettes.json';

export const trendingPalettes: SeedPalette[] = trendingData as SeedPalette[];

export const trendingTags = [
  'trending',
  'light',
  'dark',
  'vibrant',
  'muted',
  'warm',
  'cool',
  'neutral',
  'gradient',
];
