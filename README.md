# Kolors

A fast, intuitive color palette generator inspired by [Coolors.co](https://coolors.co). Built with Next.js 14, TypeScript, and Tailwind CSS.

![Kolors](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-4.0-38bdf8)

## Features

### Palette Generator (`/generate`)
- **Spacebar Generation** - Press space to generate harmonious color palettes
- **Lock Colors** - Keep your favorite colors while regenerating others
- **Drag & Reorder** - Rearrange colors by dragging
- **Color Picker** - Fine-tune any color with visual picker
- **Copy to Clipboard** - One-click copy HEX codes
- **Undo/Redo** - Full history navigation
- **Export** - CSS, SCSS, Tailwind, JSON, Array formats
- **URL Sharing** - Palettes encoded in URL for easy sharing

### Color Picker (`/color-picker`)
- **Color Conversions** - HEX, RGB, HSL, HSB, CMYK, LAB
- **Color Harmonies** - Complementary, Analogous, Triadic, Split-complementary, Tetradic, Square
- **Color Variations** - Shades (darker), Tints (lighter), Tones (muted)
- **Blindness Simulation** - Protanopia, Deuteranopia, Tritanopia, Achromatopsia
- **Quick Contrast Check** - WCAG compliance preview

### Contrast Checker (`/contrast-checker`)
- **WCAG 2.0 Compliance** - AA and AAA level checking
- **Live Preview** - See text at multiple sizes
- **Auto-Suggest** - Get accessible color alternatives
- **UI Preview** - Buttons, links, containers

### Explore Palettes (`/palettes`)
- **Curated Collection** - 28 hand-picked palettes
- **Filter by Color** - Red, Orange, Yellow, Green, Blue, Purple, Pink, Gray
- **Filter by Style** - Trending, Warm, Cool, Pastel, Dark, Vibrant, Nature, Modern, Minimal, Retro
- **Search** - By name, tags, or HEX colors
- **Sort** - Popular, Newest, Random

### Gradient Maker (`/gradient-maker`)
- **Gradient Types** - Linear, Radial, Conic
- **Multiple Stops** - 2-5 color stops with position control
- **Presets** - 8 beautiful preset gradients
- **CSS Export** - Copy CSS gradient code
- **SVG Export** - Copy as SVG data URL
- **Convert to Palette** - Generate palette from gradient

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 14](https://nextjs.org/) | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [chroma-js](https://gka.github.io/chroma.js/) | Color manipulation |
| [react-colorful](https://github.com/omgovich/react-colorful) | Color picker component |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Zustand](https://zustand-demo.pmnd.rs/) | State management |

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended)

### Installation

```bash
# Clone the repository
git clone https://github.com/barbietunnie/kolors-clone.git
cd kolors-clone

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── generate/          # Palette generator
│   ├── color-picker/      # Color info tool
│   ├── contrast-checker/  # WCAG accessibility
│   ├── palettes/          # Browse palettes
│   └── gradient-maker/    # Gradient creator
├── components/
│   ├── ui/                # Reusable UI components
│   ├── generator/         # Palette generator components
│   ├── color-picker/      # Color picker components
│   └── palettes/          # Palette browsing components
├── lib/
│   └── colors/            # Color utility functions
│       ├── conversions.ts # HEX/RGB/HSL/etc conversions
│       ├── generator.ts   # Palette generation algorithms
│       ├── harmony.ts     # Color harmony calculations
│       ├── variations.ts  # Shades, tints, tones
│       ├── contrast.ts    # WCAG contrast calculations
│       └── blindness.ts   # Color blindness simulation
├── hooks/                 # Custom React hooks
├── store/                 # Zustand state management
├── types/                 # TypeScript type definitions
└── data/                  # Static data (seed palettes)
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Generate new palette |
| `L` | Lock/unlock focused color |
| `C` | Copy focused color HEX |
| `←` / `→` | Navigate between colors |
| `⌘/Ctrl + Z` | Undo |
| `⌘/Ctrl + Shift + Z` | Redo |

## Color Algorithms

### Harmony Generation
- **Complementary** - Opposite on color wheel (180°)
- **Analogous** - Adjacent colors (±30°)
- **Triadic** - Three equally spaced (120° apart)
- **Split-complementary** - Base + two adjacent to complement
- **Tetradic** - Four colors in rectangle pattern
- **Square** - Four equally spaced (90° apart)

### Palette Generation
Palettes are generated using color theory algorithms that ensure visual harmony:
1. Random base hue selection
2. Scheme selection (analogous, complementary, triadic, split-complementary)
3. Saturation and lightness variation for depth
4. Locked color preservation during regeneration

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- Inspired by [Coolors.co](https://coolors.co)
- Color science from [chroma.js](https://gka.github.io/chroma.js/)
- Icons from [Heroicons](https://heroicons.com/)
