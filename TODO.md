# Kolors - TODO

## Pending Features

### High Priority

- [x] **Image Picker** (`/image-picker`)
  - [x] Drag & drop image upload (react-dropzone already installed)
  - [x] Display uploaded image with canvas overlay
  - [x] Auto-extract dominant colors (5-10 colors) using median cut algorithm
  - [x] Manual color picker - click on image to sample colors
  - [x] Adjustable palette size slider (2-10 colors)
  - [x] "Open in Generator" button
  - [x] Support JPG, PNG, WebP (max 10MB)
  - [x] Consider using `color-thief-browser` or `quantize` library

- [x] **Palette Visualizer** (`/visualizer`)
  - [x] Template gallery with SVG mockups:
    - [x] Website landing page
    - [x] Mobile app UI
    - [x] Business card
    - [x] Social media post
    - [x] Logo template
    - [x] Dashboard UI
  - [x] Upload custom SVG option
  - [x] Apply palette to template (color replacement)
  - [x] Spacebar to shuffle palette colors
  - [x] Download recolored design (SVG/PNG)
  - [x] Color mapping UI

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

- [x] **Dark Mode**
  - [x] App-wide dark theme toggle
  - [x] Persist preference
  - [x] Auto-detect system preference

- [x] **Mobile Responsiveness**
  - [x] Improve palette generator on mobile
  - [x] Touch-friendly color picker
  - [x] Swipe gestures for color navigation

- [x] **Collage Maker** (`/collage-maker`)
  - [x] Create color collages
  - [x] Grid layouts (2x2, 3x3, custom)
  - [x] Export as image

- [x] **Color Libraries** (`/color-libraries`)
  - [ ] Pantone color matching (requires license)
  - [x] Material Design colors
  - [x] Tailwind CSS colors
  - [x] CSS named colors

## Bug Fixes

- [ ] None reported yet

## Code Quality

- [ ] Add unit tests for color utility functions
- [ ] Add E2E tests with Playwright
- [ ] Add Storybook for component documentation
- [ ] Performance audit with Lighthouse
- [ ] Accessibility audit (beyond contrast)

## UI/UX Improvements

- [x] Add Gradient Maker to main navigation on all pages
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
- [x] Collage Maker (`/collage-maker`)
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
- [x] Dark mode with system preference detection
- [x] Mobile responsive design
- [x] Color collage creation
- [x] Material Design, Tailwind CSS, and CSS named color libraries

---

## Next Session Prompt

```
Continue building the Kolors clone by implementing medium priority features.

Project: /home/user/kolors-clone (Next.js 16, TypeScript, Tailwind v4, pnpm)
Branch: claude/implement-low-priority-todos-fmTyB

Implemented: All tools complete (Palette Generator, Color Picker, Contrast Checker,
Explore Palettes, Gradient Maker, Image Picker, Visualizer, Collage Maker, Color Libraries)
Features: Dark mode, mobile responsiveness, color libraries

Libraries: chroma-js, react-colorful, framer-motion, zustand, react-dropzone

Tasks:
1. Local Storage - Save favorite palettes, history, preferences
2. More Export Formats - PDF, ASE, PNG, SVG exports
3. Share Features - Shareable links, social sharing, embed codes

Follow existing patterns, wrap useSearchParams in Suspense, test with pnpm build, commit and push.
```
