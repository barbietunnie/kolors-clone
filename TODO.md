# Kolors - TODO

## Pending Features

### Low Priority

- [ ] **Mobile Responsiveness** (Improvements)
  - [ ] Touch-friendly color picker
  - [ ] Swipe gestures for color navigation

## Bug Fixes

- [ ] None reported yet

## Code Quality

- [ ] Add unit tests for color utility functions
- [ ] Add E2E tests with Playwright
- [ ] Add Storybook for component documentation
- [ ] Performance audit with Lighthouse
- [ ] Accessibility audit (beyond contrast)

## UI/UX Improvements

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
- [x] Image Picker (`/image-picker`)
- [x] Palette Visualizer (`/visualizer`)
- [x] Collage Maker (`/collage`)
- [x] Color Libraries (`/color-libraries`)

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

### UI/UX
- [x] Dark Mode with system preference detection
- [x] Persist theme preference
- [x] Responsive header with mobile menu
- [x] Gradient Maker in main navigation

### Color Libraries
- [x] Material Design colors
- [x] Tailwind CSS colors
- [x] CSS named colors
- [x] Color of the Year (Pantone-inspired)

### Collage Maker
- [x] Create color collages
- [x] Grid layouts (2x2, 3x3, 4x4, 2x3, 3x2, 1x4, 4x1)
- [x] Export as PNG
- [x] Export as SVG
- [x] Adjustable spacing and border radius

### Local Storage
- [x] Save favorite palettes with localStorage persistence
- [x] Palette generation history with localStorage persistence
- [x] User preferences store (color format, export format, auto-save)
- [x] Favorites panel with rename and remove actions
- [x] History panel with quick access to recent palettes

### Export Formats
- [x] PDF export with color swatches
- [x] ASE (Adobe Swatch Exchange) format for Photoshop/Illustrator
- [x] PNG image export of palette
- [x] SVG vector graphic export

### Share Features
- [x] Copy shareable link
- [x] Social media sharing (X/Twitter, Facebook, Pinterest)
- [x] HTML embed code generation
- [x] iFrame embed code with size options
