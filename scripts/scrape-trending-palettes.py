"""
Scrape trending palettes from Coolors.co using Playwright
@author Babatunde Adeyemi
"""

import json
import os
import re
from playwright.sync_api import sync_playwright

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple."""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_hsl(r, g, b):
    """Convert RGB to HSL."""
    r, g, b = r / 255.0, g / 255.0, b / 255.0
    max_c = max(r, g, b)
    min_c = min(r, g, b)
    l = (max_c + min_c) / 2.0

    if max_c == min_c:
        h = s = 0.0
    else:
        d = max_c - min_c
        s = d / (2.0 - max_c - min_c) if l > 0.5 else d / (max_c + min_c)

        if max_c == r:
            h = (g - b) / d + (6.0 if g < b else 0.0)
        elif max_c == g:
            h = (b - r) / d + 2.0
        else:
            h = (r - g) / d + 4.0
        h /= 6.0

    return h * 360, s, l

def generate_tags(colors):
    """Generate tags based on color analysis."""
    tags = ['trending']

    total_lightness = 0
    total_saturation = 0
    has_warm = False
    has_cool = False
    has_neutral = False

    for hex_color in colors:
        try:
            rgb = hex_to_rgb(hex_color)
            h, s, l = rgb_to_hsl(*rgb)

            total_lightness += l
            total_saturation += s

            if (h >= 0 and h < 60) or h > 300:
                has_warm = True
            if h >= 180 and h < 300:
                has_cool = True
            if s < 0.15:
                has_neutral = True
        except:
            continue

    if len(colors) > 0:
        avg_lightness = total_lightness / len(colors)
        avg_saturation = total_saturation / len(colors)

        if avg_lightness > 0.7:
            tags.append('light')
        if avg_lightness < 0.3:
            tags.append('dark')
        if avg_saturation > 0.7:
            tags.append('vibrant')
        if avg_saturation < 0.3:
            tags.append('muted')
        if has_warm and not has_cool:
            tags.append('warm')
        if has_cool and not has_warm:
            tags.append('cool')
        if has_neutral:
            tags.append('neutral')
        if len(colors) >= 4:
            tags.append('gradient')

    return tags[:5]

def generate_palette_name(colors, index):
    """Generate a name for the palette."""
    name_patterns = [
        'Trending Palette',
        'Popular Mix',
        'Color Story',
        'Modern Blend',
        'Creative Combo',
        'Fresh Palette',
        'Stylish Hues',
        'Design Palette',
        'Artistic Blend',
        'Visual Harmony',
    ]

    base_index = index % len(name_patterns)
    suffix = index // len(name_patterns) + 1

    return f"{name_patterns[base_index]} {suffix}" if suffix > 1 else name_patterns[base_index]

def scrape_trending_palettes():
    """Scrape trending palettes from Coolors.co."""
    palettes = []

    print('Starting Playwright browser...')
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        )
        page = context.new_page()

        print('Navigating to Coolors trending palettes...')
        page.goto('https://coolors.co/palettes/trending', wait_until='domcontentloaded', timeout=90000)

        # Wait for content to load
        print('Waiting for page content to load...')
        page.wait_for_timeout(5000)

        # Scroll multiple times to load all palettes (infinite scroll)
        print('Scrolling to load all palettes...')
        prev_height = 0
        scroll_count = 0
        max_scrolls = 50  # Limit to prevent infinite loop

        while scroll_count < max_scrolls:
            # Get current scroll height
            current_height = page.evaluate('document.body.scrollHeight')

            # Scroll to bottom
            page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
            page.wait_for_timeout(2000)  # Wait for content to load

            # Check if we've reached the bottom (no new content loaded)
            new_height = page.evaluate('document.body.scrollHeight')
            if new_height == current_height:
                # Try a few more times to make sure
                for _ in range(3):
                    page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
                    page.wait_for_timeout(2000)
                    if page.evaluate('document.body.scrollHeight') > new_height:
                        break
                else:
                    print(f'Reached bottom after {scroll_count + 1} scrolls')
                    break

            scroll_count += 1
            if scroll_count % 5 == 0:
                print(f'  Scrolled {scroll_count} times...')

        # Extract palette links (more reliable method)
        print('Extracting palette data from links...')
        links = page.evaluate('''
            () => {
                const anchors = document.querySelectorAll('a[href*="/palette/"]');
                const urls = [];
                anchors.forEach((a) => {
                    const href = a.getAttribute('href');
                    if (href && href.includes('/palette/')) {
                        urls.push(href);
                    }
                });
                return [...new Set(urls)];
            }
        ''')

        print(f'Found {len(links)} palette links')

        for link in links:
            match = re.search(r'palette/([a-fA-F0-9-]+)', link)
            if match:
                color_hexes = [c for c in match.group(1).split('-') if len(c) == 6]
                if len(color_hexes) >= 3:
                    colors = ['#' + c.upper() for c in color_hexes]
                    palettes.append({'colors': colors})

        # If no links found, try extracting from page content directly
        if len(palettes) == 0:
            print('Trying alternative extraction from page content...')

            # Try to get colors from style attributes
            palette_data = page.evaluate('''
                () => {
                    const results = [];
                    // Look for palette containers
                    const containers = document.querySelectorAll('[class*="palette"], [class*="Palette"]');

                    containers.forEach(container => {
                        const colors = [];
                        const colorElements = container.querySelectorAll('div[style*="background"]');

                        colorElements.forEach(el => {
                            const style = el.getAttribute('style') || '';
                            const bgMatch = style.match(/background(?:-color)?:\s*#([a-fA-F0-9]{6})/);
                            if (bgMatch) {
                                colors.push('#' + bgMatch[1].toUpperCase());
                            } else {
                                // Try computed style
                                const computed = window.getComputedStyle(el);
                                const bgColor = computed.backgroundColor;
                                if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
                                    const rgb = bgColor.match(/\\d+/g);
                                    if (rgb && rgb.length >= 3) {
                                        const hex = '#' + rgb.slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('').toUpperCase();
                                        colors.push(hex);
                                    }
                                }
                            }
                        });

                        if (colors.length >= 3 && colors.length <= 10) {
                            results.push({ colors: colors });
                        }
                    });

                    return results;
                }
            ''')

            palettes = palette_data

        browser.close()

    # Remove duplicates based on colors
    seen = set()
    unique_palettes = []
    for p in palettes:
        key = '-'.join(p['colors'])
        if key not in seen:
            seen.add(key)
            unique_palettes.append(p)

    # Generate metadata
    import random
    trending_palettes = []
    for index, palette in enumerate(unique_palettes):
        colors = palette['colors']
        tags = generate_tags(colors)
        name = generate_palette_name(colors, index)

        trending_palettes.append({
            'id': f'trending-{index + 1}',
            'colors': colors,
            'name': name,
            'tags': tags,
            'likes': random.randint(500, 5000),
        })

    print(f'Extracted {len(trending_palettes)} unique trending palettes')
    return trending_palettes

def main():
    """Main function."""
    try:
        palettes = scrape_trending_palettes()

        # Save to JSON file
        output_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'trending-palettes.json')
        with open(output_path, 'w') as f:
            json.dump(palettes, f, indent=2)
        print(f'\nSaved palettes to {output_path}')

        # Output for verification
        print('\nExtracted palettes:')
        for i, p in enumerate(palettes):
            print(f"{i + 1}. {p['name']}: {', '.join(p['colors'])}")
    except Exception as e:
        print(f'Error scraping palettes: {e}')
        import traceback
        traceback.print_exc()
        exit(1)

if __name__ == '__main__':
    main()
