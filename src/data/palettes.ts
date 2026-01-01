export interface SeedPalette {
  id: string;
  colors: string[];
  name: string;
  tags: string[];
  likes: number;
}

export const seedPalettes: SeedPalette[] = [
  // Trending palettes
  {
    id: '1',
    colors: ['#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51'],
    name: 'Tropical Sunset',
    tags: ['warm', 'nature', 'trending'],
    likes: 1284,
  },
  {
    id: '2',
    colors: ['#606C38', '#283618', '#FEFAE0', '#DDA15E', '#BC6C25'],
    name: 'Earthy Tones',
    tags: ['earth', 'natural', 'warm'],
    likes: 892,
  },
  {
    id: '3',
    colors: ['#003049', '#D62828', '#F77F00', '#FCBF49', '#EAE2B7'],
    name: 'Bold Statement',
    tags: ['bold', 'contrast', 'vibrant'],
    likes: 1567,
  },
  {
    id: '4',
    colors: ['#5F0F40', '#9A031E', '#FB8B24', '#E36414', '#0F4C5C'],
    name: 'Autumn Fire',
    tags: ['warm', 'autumn', 'bold'],
    likes: 743,
  },
  {
    id: '5',
    colors: ['#0D1B2A', '#1B263B', '#415A77', '#778DA9', '#E0E1DD'],
    name: 'Midnight Blue',
    tags: ['dark', 'blue', 'professional'],
    likes: 2103,
  },
  // Pastel palettes
  {
    id: '6',
    colors: ['#FFE5EC', '#FFC2D1', '#FFB3C6', '#FF8FAB', '#FB6F92'],
    name: 'Pink Dreams',
    tags: ['pastel', 'pink', 'soft'],
    likes: 956,
  },
  {
    id: '7',
    colors: ['#CDB4DB', '#FFC8DD', '#FFAFCC', '#BDE0FE', '#A2D2FF'],
    name: 'Cotton Candy',
    tags: ['pastel', 'soft', 'feminine'],
    likes: 1834,
  },
  {
    id: '8',
    colors: ['#F0EFEB', '#DFE7FD', '#D0D1FF', '#C8B6FF', '#B8C0FF'],
    name: 'Lavender Mist',
    tags: ['pastel', 'purple', 'calm'],
    likes: 621,
  },
  // Dark palettes
  {
    id: '9',
    colors: ['#000000', '#14213D', '#FCA311', '#E5E5E5', '#FFFFFF'],
    name: 'Dark Contrast',
    tags: ['dark', 'contrast', 'modern'],
    likes: 1456,
  },
  {
    id: '10',
    colors: ['#10002B', '#240046', '#3C096C', '#5A189A', '#7B2CBF'],
    name: 'Deep Purple',
    tags: ['dark', 'purple', 'gradient'],
    likes: 1123,
  },
  {
    id: '11',
    colors: ['#03071E', '#370617', '#6A040F', '#9D0208', '#DC2F02'],
    name: 'Dark Fire',
    tags: ['dark', 'red', 'intense'],
    likes: 876,
  },
  // Cool palettes
  {
    id: '12',
    colors: ['#CAF0F8', '#90E0EF', '#00B4D8', '#0077B6', '#03045E'],
    name: 'Ocean Depths',
    tags: ['blue', 'cool', 'gradient'],
    likes: 1987,
  },
  {
    id: '13',
    colors: ['#D8F3DC', '#B7E4C7', '#95D5B2', '#74C69D', '#52B788'],
    name: 'Forest Green',
    tags: ['green', 'nature', 'fresh'],
    likes: 1234,
  },
  {
    id: '14',
    colors: ['#E2E8F0', '#CBD5E1', '#94A3B8', '#64748B', '#475569'],
    name: 'Slate Gray',
    tags: ['gray', 'neutral', 'professional'],
    likes: 567,
  },
  // Warm palettes
  {
    id: '15',
    colors: ['#FFEDD8', '#F3D5B5', '#E7BC91', '#D4A276', '#BC8A5F'],
    name: 'Sandy Beach',
    tags: ['warm', 'neutral', 'soft'],
    likes: 789,
  },
  {
    id: '16',
    colors: ['#FF9F1C', '#FFBF69', '#FFFFFF', '#CBF3F0', '#2EC4B6'],
    name: 'Summer Vibes',
    tags: ['warm', 'summer', 'bright'],
    likes: 1654,
  },
  {
    id: '17',
    colors: ['#9B2226', '#AE2012', '#BB3E03', '#CA6702', '#EE9B00'],
    name: 'Warm Gradient',
    tags: ['warm', 'gradient', 'red'],
    likes: 934,
  },
  // Modern/Tech palettes
  {
    id: '18',
    colors: ['#7400B8', '#6930C3', '#5E60CE', '#5390D9', '#4EA8DE'],
    name: 'Cyber Purple',
    tags: ['modern', 'tech', 'gradient'],
    likes: 2456,
  },
  {
    id: '19',
    colors: ['#2D00F7', '#6A00F4', '#8900F2', '#A100F2', '#B100E8'],
    name: 'Neon Nights',
    tags: ['neon', 'vibrant', 'modern'],
    likes: 1876,
  },
  {
    id: '20',
    colors: ['#1A1A2E', '#16213E', '#0F3460', '#E94560', '#FFFFFF'],
    name: 'Dark UI',
    tags: ['dark', 'ui', 'modern'],
    likes: 3214,
  },
  // Nature palettes
  {
    id: '21',
    colors: ['#06D6A0', '#1B9AAA', '#EF476F', '#FFC43D', '#F8FFE5'],
    name: 'Tropical',
    tags: ['nature', 'tropical', 'vibrant'],
    likes: 1432,
  },
  {
    id: '22',
    colors: ['#386641', '#6A994E', '#A7C957', '#F2E8CF', '#BC4749'],
    name: 'Garden Fresh',
    tags: ['nature', 'green', 'fresh'],
    likes: 876,
  },
  {
    id: '23',
    colors: ['#463F3A', '#8A817C', '#BCB8B1', '#F4F3EE', '#E0AFA0'],
    name: 'Stone & Rose',
    tags: ['neutral', 'elegant', 'soft'],
    likes: 654,
  },
  // Retro palettes
  {
    id: '24',
    colors: ['#FF6B6B', '#FEC89A', '#FFD93D', '#6BCB77', '#4D96FF'],
    name: 'Retro Pop',
    tags: ['retro', 'vibrant', 'fun'],
    likes: 1987,
  },
  {
    id: '25',
    colors: ['#F72585', '#B5179E', '#7209B7', '#560BAD', '#480CA8'],
    name: 'Synthwave',
    tags: ['retro', 'neon', 'dark'],
    likes: 2543,
  },
  // Minimal palettes
  {
    id: '26',
    colors: ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#9E9E9E', '#212121'],
    name: 'Minimal Gray',
    tags: ['minimal', 'gray', 'clean'],
    likes: 1234,
  },
  {
    id: '27',
    colors: ['#FAFAFA', '#F5F5F5', '#EEEEEE', '#E0E0E0', '#BDBDBD'],
    name: 'Light Minimal',
    tags: ['minimal', 'light', 'clean'],
    likes: 567,
  },
  {
    id: '28',
    colors: ['#2C3E50', '#34495E', '#95A5A6', '#BDC3C7', '#ECF0F1'],
    name: 'Flat UI',
    tags: ['flat', 'ui', 'professional'],
    likes: 1876,
  },
];

export const allTags = [
  'trending',
  'warm',
  'cool',
  'pastel',
  'dark',
  'vibrant',
  'nature',
  'modern',
  'minimal',
  'retro',
  'gradient',
  'neutral',
  'professional',
];

export const colorFilters = [
  { name: 'Red', hex: '#EF4444' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Yellow', hex: '#EAB308' },
  { name: 'Green', hex: '#22C55E' },
  { name: 'Blue', hex: '#3B82F6' },
  { name: 'Purple', hex: '#A855F7' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Gray', hex: '#6B7280' },
];
