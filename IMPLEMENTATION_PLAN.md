# Kolors Clone - Implementation Plan

A comprehensive clone of [Coolors.co](https://coolors.co/) - the super fast color palette generator.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Tools to Implement](#tools-to-implement)
4. [Project Structure](#project-structure)
5. [Implementation Phases](#implementation-phases)
6. [Detailed Feature Specifications](#detailed-feature-specifications)
7. [Color Utilities Library](#color-utilities-library)
8. [Export Formats](#export-formats)
9. [UI/UX Considerations](#uiux-considerations)

---

## Project Overview

### Goals
- Build a fully-functional color palette generator web application
- Implement all core Coolors tools
- Provide intuitive keyboard shortcuts and smooth UX
- Support multiple export formats
- Ensure accessibility (WCAG compliance)

### Target Features (Priority Order)
1. ✅ Palette Generator (Core)
2. ✅ Color Picker
3. ✅ Contrast Checker
4. ✅ Image Color Extractor
5. ✅ Explore Palettes
6. ✅ Gradient Maker
7. ✅ Palette Visualizer
8. ⬜ Collage Maker (Optional)

---

## Tech Stack

### Frontend Framework
| Technology | Purpose |
|------------|---------|
| **Next.js 14+** | React framework with App Router, SSR, and API routes |
| **TypeScript** | Type safety and better DX |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Smooth animations |

### Color Libraries
| Library | Purpose |
|---------|---------|
| **chroma-js** | Color manipulation, conversions, scales |
| **colord** | Lightweight color parsing and manipulation |
| **color-namer** | Name colors from HEX values |

### Additional Libraries
| Library | Purpose |
|---------|---------|
| **react-colorful** | Lightweight color picker component |
| **html2canvas** | Export palettes as images |
| **file-saver** | Client-side file downloads |
| **zustand** | Lightweight state management |
| **react-dropzone** | Image upload handling |
| **color-thief-browser** | Extract colors from images |

---

## Tools to Implement

### 1. Palette Generator (`/generate`)
The flagship feature - generate harmonious 5-color palettes.

**Features:**
- Press **Spacebar** to generate new random palette
- **Lock colors** - Click lock icon to keep colors while regenerating others
- **Drag to reorder** - Rearrange colors by dragging
- **Adjust individual colors** - Click to open color picker
- **View color info** - HEX, RGB, HSL, CMYK values
- **Copy color codes** - One-click copy to clipboard
- **Add/remove colors** - Expand palette (up to 10 colors)
- **Undo/Redo** - History navigation
- **Quick actions menu** per color:
  - View color info
  - Adjust color (hue, saturation, brightness)
  - Copy HEX/RGB/HSL
  - Get color shades/tints
  - Remove color

**Keyboard Shortcuts:**
| Key | Action |
|-----|--------|
| `Space` | Generate new palette |
| `L` | Lock/unlock focused color |
| `C` | Copy focused color HEX |
| `←/→` | Navigate colors |
| `⌘/Ctrl + Z` | Undo |
| `⌘/Ctrl + Shift + Z` | Redo |

**Color Generation Algorithms:**
- Random generation with harmony rules
- Complementary
- Analogous
- Triadic
- Split-complementary
- Tetradic

---

### 2. Color Picker (`/color-picker` or `/color/:hex`)
Comprehensive color information tool.

**Features:**
- **Color input** - HEX, RGB, HSL, HSB, CMYK, LAB
- **Visual picker** - Spectrum + hue slider
- **Color conversions** - Display all formats
- **Color variations:**
  - Shades (add black)
  - Tints (add white)
  - Tones (add gray)
  - Hues (shift hue)
- **Color harmonies:**
  - Complementary
  - Analogous
  - Triadic
  - Split-complementary
  - Tetradic
  - Square
- **Blindness simulator:**
  - Protanopia (red-blind)
  - Deuteranopia (green-blind)
  - Tritanopia (blue-blind)
  - Achromatopsia (total color blindness)
- **Contrast checker** - Quick AA/AAA check
- **Similar colors** - Find visually similar colors
- **Color name** - Nearest named color

---

### 3. Contrast Checker (`/contrast-checker`)
WCAG accessibility contrast ratio calculator.

**Features:**
- **Two color inputs** - Foreground (text) and background
- **Live preview** - Sample text on background
- **Contrast ratio** - Calculate and display ratio (e.g., 4.5:1)
- **WCAG ratings:**
  - **AA Normal** - Minimum 4.5:1
  - **AA Large** - Minimum 3:1
  - **AAA Normal** - Minimum 7:1
  - **AAA Large** - Minimum 4.5:1
- **Pass/Fail indicators** - Visual badges
- **Suggestions** - Auto-suggest accessible alternatives
- **Swap colors** - Quick foreground/background swap
- **Sample text sizes** - Preview at different sizes

---

### 4. Image Color Extractor (`/image-picker`)
Extract color palettes from uploaded images.

**Features:**
- **Upload methods:**
  - Drag & drop
  - File picker
  - Paste from clipboard
  - URL input
  - Webcam capture
- **Automatic extraction** - Dominant colors using k-means/median cut
- **Manual picker** - Click on image to pick colors
- **Adjustable palette size** - 2-10 colors
- **Multiple palette suggestions** - Slider to browse variations
- **Send to generator** - Open extracted palette in generator
- **Image size limit** - Max 10MB

**Algorithm:**
- Use **color-thief** or implement **Median Cut Algorithm**
- Cluster similar colors
- Sort by dominance/vibrancy

---

### 5. Explore Palettes (`/palettes`)
Browse and discover color palettes.

**Features:**
- **Browse modes:**
  - Trending
  - Popular (all time)
  - New
  - Random
- **Filter by:**
  - Color (red, blue, green, etc.)
  - Style (pastel, dark, warm, cool, gradient, contrast)
  - Number of colors
- **Search** - By keyword, HEX, or tag
- **Palette cards:**
  - Color swatches
  - Like count
  - Save button
  - Open in generator
  - Quick copy
- **Infinite scroll** or pagination
- **Responsive grid**

**Data Storage:**
- For MVP: Use predefined palette JSON/seed data
- Future: Database with user-generated palettes

---

### 6. Gradient Maker (`/gradient-maker`)
Create and customize gradients.

**Features:**
- **Gradient types:**
  - Linear
  - Radial
  - Conic
- **Color stops:**
  - Add/remove stops
  - Drag to reposition
  - Adjust colors
- **Direction control** - Angle slider or presets
- **Preview panel** - Large gradient preview
- **CSS output** - Copy CSS gradient code
- **Export options:**
  - CSS
  - SVG
  - PNG/JPG image
- **Gradient palettes** - Generate palette from gradient

---

### 7. Gradient Palette (`/gradient-palette`)
Create smooth color transitions between colors.

**Features:**
- **Start/end colors** - Pick two colors
- **Steps slider** - 2-20 intermediate colors
- **Preview** - Visual palette strip
- **Export** - As palette or gradient
- **Send to generator** - Open as editable palette

---

### 8. Palette Visualizer (`/visualizer`)
Preview palettes on real designs.

**Features:**
- **Template library:**
  - Website mockups
  - App UI mockups
  - Logo templates
  - Business card
  - Social media templates
- **SVG upload** - Upload custom SVG, auto-recolor
- **Live recoloring** - Apply palette to template
- **Spacebar shuffle** - Quick palette cycling
- **Download** - Export recolored design

---

## Project Structure

```
kolors-clone/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   ├── generate/
│   │   │   └── page.tsx          # Palette generator
│   │   │   └── [[...colors]]/    # Dynamic route for palette URLs
│   │   ├── color-picker/
│   │   │   └── page.tsx
│   │   ├── color/
│   │   │   └── [hex]/page.tsx    # Color info page
│   │   ├── contrast-checker/
│   │   │   └── page.tsx
│   │   ├── image-picker/
│   │   │   └── page.tsx
│   │   ├── palettes/
│   │   │   └── page.tsx          # Explore palettes
│   │   ├── gradient-maker/
│   │   │   └── page.tsx
│   │   ├── gradient-palette/
│   │   │   └── page.tsx
│   │   └── visualizer/
│   │       └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Dropdown.tsx
│   │   │   ├── Tooltip.tsx
│   │   │   ├── Slider.tsx
│   │   │   └── ColorInput.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── generator/
│   │   │   ├── PaletteGenerator.tsx
│   │   │   ├── ColorColumn.tsx
│   │   │   ├── ColorActions.tsx
│   │   │   ├── GeneratorToolbar.tsx
│   │   │   └── ExportModal.tsx
│   │   │
│   │   ├── color-picker/
│   │   │   ├── ColorPicker.tsx
│   │   │   ├── ColorSpectrum.tsx
│   │   │   ├── ColorSliders.tsx
│   │   │   ├── ColorHarmonies.tsx
│   │   │   ├── ColorVariations.tsx
│   │   │   └── BlindnessSimulator.tsx
│   │   │
│   │   ├── contrast/
│   │   │   ├── ContrastChecker.tsx
│   │   │   ├── ContrastPreview.tsx
│   │   │   └── WCAGBadges.tsx
│   │   │
│   │   ├── image-picker/
│   │   │   ├── ImageUploader.tsx
│   │   │   ├── ImageCanvas.tsx
│   │   │   └── ExtractedPalette.tsx
│   │   │
│   │   ├── palettes/
│   │   │   ├── PaletteGrid.tsx
│   │   │   ├── PaletteCard.tsx
│   │   │   └── PaletteFilters.tsx
│   │   │
│   │   ├── gradient/
│   │   │   ├── GradientEditor.tsx
│   │   │   ├── GradientPreview.tsx
│   │   │   └── ColorStops.tsx
│   │   │
│   │   └── visualizer/
│   │       ├── TemplateGallery.tsx
│   │       ├── SVGRecolorer.tsx
│   │       └── VisualizerCanvas.tsx
│   │
│   ├── lib/
│   │   ├── colors/
│   │   │   ├── conversions.ts    # HEX/RGB/HSL/CMYK/LAB conversions
│   │   │   ├── harmony.ts        # Color harmony generators
│   │   │   ├── contrast.ts       # WCAG contrast calculations
│   │   │   ├── blindness.ts      # Color blindness simulation
│   │   │   ├── variations.ts     # Shades, tints, tones
│   │   │   ├── generator.ts      # Random palette generation
│   │   │   ├── extractor.ts      # Image color extraction
│   │   │   └── naming.ts         # Color naming utilities
│   │   │
│   │   ├── utils/
│   │   │   ├── clipboard.ts      # Copy to clipboard
│   │   │   ├── export.ts         # Export utilities (PNG, PDF, SVG, CSS)
│   │   │   ├── url.ts            # URL/sharing utilities
│   │   │   └── keyboard.ts       # Keyboard shortcut handling
│   │   │
│   │   └── constants/
│   │       ├── colors.ts         # Named colors, CSS colors
│   │       ├── palettes.ts       # Seed palettes for explore
│   │       └── templates.ts      # Visualizer templates
│   │
│   ├── hooks/
│   │   ├── useColorGenerator.ts
│   │   ├── useKeyboardShortcuts.ts
│   │   ├── useClipboard.ts
│   │   ├── useHistory.ts         # Undo/redo
│   │   ├── useLocalStorage.ts
│   │   └── useImageExtractor.ts
│   │
│   ├── store/
│   │   ├── paletteStore.ts       # Zustand store for palette state
│   │   └── settingsStore.ts      # User preferences
│   │
│   └── types/
│       ├── color.ts              # Color type definitions
│       ├── palette.ts            # Palette type definitions
│       └── export.ts             # Export option types
│
├── public/
│   ├── templates/                # SVG templates for visualizer
│   └── fonts/
│
├── data/
│   └── palettes.json             # Seed palettes for explore
│
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
**Goal:** Set up project and core utilities

- [ ] Initialize Next.js project with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Set up project structure
- [ ] Install dependencies
- [ ] Create color utility library:
  - [ ] Color conversions (HEX ↔ RGB ↔ HSL ↔ HSB ↔ CMYK)
  - [ ] Color validation
  - [ ] Random color generation
  - [ ] Color harmony algorithms
- [ ] Create reusable UI components:
  - [ ] Button, Input, Modal, Tooltip
  - [ ] Color input component
- [ ] Set up layout (Header, Navigation)

### Phase 2: Palette Generator (Week 2)
**Goal:** Build the core palette generator

- [ ] Create palette generator page
- [ ] Implement color column component
- [ ] Add spacebar generation
- [ ] Implement lock/unlock functionality
- [ ] Add drag-to-reorder
- [ ] Implement color adjustment panel
- [ ] Add copy functionality
- [ ] Implement undo/redo history
- [ ] Add keyboard shortcuts
- [ ] Create export modal (PNG, SVG, CSS, PDF)
- [ ] URL-based palette sharing

### Phase 3: Color Picker (Week 3)
**Goal:** Comprehensive color information tool

- [ ] Create color picker page
- [ ] Implement color spectrum picker
- [ ] Add color input (all formats)
- [ ] Display color conversions
- [ ] Implement color variations (shades, tints, tones)
- [ ] Add color harmonies display
- [ ] Implement color blindness simulator
- [ ] Add color naming
- [ ] Quick contrast check

### Phase 4: Contrast Checker (Week 3)
**Goal:** WCAG accessibility tool

- [ ] Create contrast checker page
- [ ] Implement contrast ratio calculation
- [ ] Add WCAG level badges (AA, AAA)
- [ ] Create live preview component
- [ ] Add color swap functionality
- [ ] Implement auto-suggest accessible colors

### Phase 5: Image Picker (Week 4)
**Goal:** Extract palettes from images

- [ ] Create image picker page
- [ ] Implement drag-and-drop upload
- [ ] Add image URL input
- [ ] Implement color extraction algorithm
- [ ] Create manual color picker on image
- [ ] Add palette size control
- [ ] Connect to palette generator

### Phase 6: Explore Palettes (Week 4)
**Goal:** Browse and discover palettes

- [ ] Create explore page
- [ ] Design palette card component
- [ ] Implement filtering (color, style)
- [ ] Add search functionality
- [ ] Create seed palette data
- [ ] Implement infinite scroll
- [ ] Add save/favorite functionality

### Phase 7: Gradient Tools (Week 5)
**Goal:** Gradient maker and palette

- [ ] Create gradient maker page
- [ ] Implement gradient editor
- [ ] Add color stop controls
- [ ] Support linear/radial/conic
- [ ] CSS export
- [ ] Create gradient palette page
- [ ] Steps interpolation

### Phase 8: Palette Visualizer (Week 5)
**Goal:** Preview palettes on designs

- [ ] Create visualizer page
- [ ] Add template gallery
- [ ] Implement SVG recoloring
- [ ] Add custom SVG upload
- [ ] Spacebar palette cycling
- [ ] Export recolored designs

### Phase 9: Polish & Optimization (Week 6)
**Goal:** Final touches

- [ ] Performance optimization
- [ ] Mobile responsiveness
- [ ] Accessibility audit
- [ ] SEO optimization
- [ ] Error handling
- [ ] Loading states
- [ ] Final testing

---

## Detailed Feature Specifications

### Color Object Structure

```typescript
interface Color {
  hex: string;          // "#FF5733"
  rgb: RGB;             // { r: 255, g: 87, b: 51 }
  hsl: HSL;             // { h: 11, s: 100, l: 60 }
  hsb: HSB;             // { h: 11, s: 80, b: 100 }
  cmyk: CMYK;           // { c: 0, m: 66, y: 80, k: 0 }
  lab: LAB;             // { l: 56, a: 58, b: 52 }
  name: string;         // "Orange Red"
  isLocked: boolean;    // For generator
}

interface Palette {
  id: string;
  colors: Color[];
  name?: string;
  tags?: string[];
  createdAt: Date;
  likes?: number;
}
```

### Export Formats

| Format | Description |
|--------|-------------|
| **URL** | Shareable link with colors in path |
| **PNG** | Image of palette swatches |
| **SVG** | Vector palette graphic |
| **PDF** | Document with color info |
| **CSS** | CSS variables or classes |
| **SCSS** | SCSS variables |
| **Tailwind** | Tailwind config colors |
| **JSON** | Raw color data |
| **ASE** | Adobe Swatch Exchange |

---

## Color Utilities Library

### Core Conversions

```typescript
// conversions.ts
hexToRgb(hex: string): RGB
rgbToHex(rgb: RGB): string
rgbToHsl(rgb: RGB): HSL
hslToRgb(hsl: HSL): RGB
rgbToHsb(rgb: RGB): HSB
hsbToRgb(hsb: HSB): RGB
rgbToCmyk(rgb: RGB): CMYK
cmykToRgb(cmyk: CMYK): RGB
rgbToLab(rgb: RGB): LAB
labToRgb(lab: LAB): RGB
```

### Harmony Generation

```typescript
// harmony.ts
getComplementary(color: Color): Color[]
getAnalogous(color: Color): Color[]
getTriadic(color: Color): Color[]
getSplitComplementary(color: Color): Color[]
getTetradic(color: Color): Color[]
getSquare(color: Color): Color[]
```

### Contrast Calculation

```typescript
// contrast.ts
getContrastRatio(fg: Color, bg: Color): number
meetsWCAG(ratio: number, level: 'AA' | 'AAA', size: 'normal' | 'large'): boolean
suggestAccessibleColor(fg: Color, bg: Color, targetRatio: number): Color
```

### Color Blindness Simulation

```typescript
// blindness.ts
type BlindnessType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'
simulateColorBlindness(color: Color, type: BlindnessType): Color
```

---

## UI/UX Considerations

### Keyboard-First Design
- Spacebar for generation
- Arrow keys for navigation
- Single-key shortcuts (L for lock, C for copy)
- Escape to close modals

### Responsive Design
- Desktop: Full multi-column palette view
- Tablet: Collapsible panels
- Mobile: Stacked color cards with swipe

### Animations
- Smooth color transitions
- Lock/unlock animations
- Palette shuffle effects
- Modal transitions

### Accessibility
- Proper ARIA labels
- Keyboard navigation
- Color contrast in UI itself
- Screen reader support

---

## Getting Started Commands

```bash
# Initialize project
npx create-next-app@latest kolors-clone --typescript --tailwind --app --src-dir

# Install dependencies
npm install chroma-js colord color-namer react-colorful
npm install framer-motion zustand react-dropzone
npm install html2canvas file-saver
npm install @types/chroma-js --save-dev

# Development
npm run dev

# Build
npm run build
```

---

## Summary

This implementation plan covers:

- **8 major tools** to implement
- **6 implementation phases**
- Complete **project structure**
- Detailed **color utilities library**
- **Export formats** specification
- **UI/UX guidelines**

The priority order ensures we build the most impactful features first (Palette Generator) while laying a solid foundation of reusable color utilities.

---

**Ready to proceed?** Once approved, we'll start with Phase 1: Project setup and color utilities foundation.
