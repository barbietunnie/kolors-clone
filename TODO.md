# Kolors - TODO

## Pending Features

### High Priority

- [ ] **Image Picker** (`/image-picker`)
  - [ ] Drag & drop image upload (react-dropzone already installed)
  - [ ] Display uploaded image with canvas overlay
  - [ ] Auto-extract dominant colors (5-10 colors) using median cut algorithm
  - [ ] Manual color picker - click on image to sample colors
  - [ ] Adjustable palette size slider (2-10 colors)
  - [ ] "Open in Generator" button
  - [ ] Support JPG, PNG, WebP (max 10MB)
  - [ ] Consider using `color-thief-browser` or `quantize` library

- [ ] **Palette Visualizer** (`/visualizer`)
  - [ ] Template gallery with SVG mockups:
    - [ ] Website landing page
    - [ ] Mobile app UI
    - [ ] Business card
    - [ ] Social media post
    - [ ] Logo template
    - [ ] Dashboard UI
  - [ ] Upload custom SVG option
  - [ ] Apply palette to template (color replacement)
  - [ ] Spacebar to shuffle palette colors
  - [ ] Download recolored design (SVG/PNG)
  - [ ] Color mapping UI

### Medium Priority

- [ ] **Local Storage**
  - [ ] Save favorite palettes
  - [ ] Recently viewed palettes history
  - [ ] User preferences (default palette size, etc.)

- [ ] **More Export Formats**
  - [ ] PDF export with color info
  - [ ] ASE (Adobe Swatch Exchange) format
  - [ ] PNG image of palette
  - [ ] SVG palette graphic

- [ ] **Share Features**
  - [ ] Copy shareable link
  - [ ] Social media sharing (Twitter, Pinterest)
  - [ ] Embed code generation

### Low Priority

- [ ] **Dark Mode**
  - [ ] App-wide dark theme toggle
  - [ ] Persist preference
  - [ ] Auto-detect system preference

- [ ] **Mobile Responsiveness**
  - [ ] Improve palette generator on mobile
  - [ ] Touch-friendly color picker
  - [ ] Swipe gestures for color navigation

- [ ] **Collage Maker**
  - [ ] Create color collages
  - [ ] Grid layouts (2x2, 3x3, custom)
  - [ ] Export as image

- [ ] **Color Libraries**
  - [ ] Pantone color matching
  - [ ] Material Design colors
  - [ ] Tailwind CSS colors
  - [ ] CSS named colors

## Bug Fixes

- [ ] None reported yet

## Code Quality

- [ ] Add unit tests for color utility functions
- [ ] Add E2E tests with Playwright
- [ ] Add Storybook for component documentation
- [ ] Performance audit with Lighthouse
- [ ] Accessibility audit (beyond contrast)

## UI/UX Improvements

- [ ] Add Gradient Maker to main navigation on all pages
- [ ] Loading skeletons for better perceived performance
- [ ] Keyboard navigation improvements
- [ ] Tooltip consistency across all tools
- [ ] Empty states for filtered results
- [ ] Error boundaries for graceful error handling

## Documentation

- [x] README with project overview
- [x] Implementation plan document
- [ ] API documentation for color utilities
- [ ] Contributing guidelines
- [ ] Code of conduct

---

## Completed

### Tools
- [x] Palette Generator (`/generate`)
- [x] Color Picker (`/color-picker`)
- [x] Contrast Checker (`/contrast-checker`)
- [x] Explore Palettes (`/palettes`)
- [x] Gradient Maker (`/gradient-maker`)

### Core Features
- [x] Color conversions (HEX, RGB, HSL, HSB, CMYK, LAB)
- [x] Color harmony algorithms
- [x] Color variations (shades, tints, tones)
- [x] Color blindness simulation
- [x] WCAG contrast calculation
- [x] Palette generation with lock/unlock
- [x] Drag-to-reorder colors
- [x] Undo/redo history
- [x] Keyboard shortcuts
- [x] Export (CSS, SCSS, Tailwind, JSON, Array)
- [x] URL-based palette sharing
- [x] Curated palette collection with filters

---

## Next Session Prompt

```
Continue building the Kolors clone by implementing Image Picker and Palette Visualizer.

Project: /home/user/kolors-clone (Next.js 14, TypeScript, Tailwind, pnpm)
Branch: claude/clone-coolors-app-UQK08

Implemented: Palette Generator, Color Picker, Contrast Checker, Explore Palettes, Gradient Maker
Libraries: chroma-js, react-colorful, framer-motion, zustand, react-dropzone

Tasks:
1. Image Picker (/image-picker) - Extract colors from uploaded images
2. Palette Visualizer (/visualizer) - Preview palettes on SVG mockups

Follow existing patterns, wrap useSearchParams in Suspense, test with pnpm build, commit and push.
```
