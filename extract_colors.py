#!/usr/bin/env python3
"""
Extract colors from coolors.co/colors using Playwright
Author: Babatunde Adeyemi
"""

import json
import asyncio
from playwright.async_api import async_playwright


async def extract_colors():
    """Extract all colors from coolors.co/colors page."""

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        )
        page = await context.new_page()

        print("Navigating to coolors.co/colors...")
        await page.goto('https://coolors.co/colors', wait_until='domcontentloaded', timeout=60000)

        # Wait for the page to stabilize
        await asyncio.sleep(5)

        # Close any popup modals by pressing Escape
        try:
            await page.keyboard.press('Escape')
            await asyncio.sleep(1)
        except:
            pass

        # Scroll to load all colors - more colors load as user scrolls
        print("Scrolling to load all colors (this loads more colors dynamically)...")
        previous_count = 0
        no_change_count = 0

        for i in range(100):  # More scrolls to load all colors
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
            await asyncio.sleep(0.5)

            # Check current color count
            current_count = await page.evaluate('document.querySelectorAll(".color-card").length')

            if i % 10 == 0:
                print(f"  Scroll {i+1}: {current_count} colors loaded...")

            if current_count == previous_count:
                no_change_count += 1
                if no_change_count >= 5:  # Stop if no new colors for 5 scrolls
                    print(f"  No new colors loaded. Stopping scroll.")
                    break
            else:
                no_change_count = 0

            previous_count = current_count

        print(f"Total color cards found: {previous_count}")

        # Extract colors using the discovered structure
        print("Extracting color data...")
        color_data = await page.evaluate('''() => {
            const colors = [];

            // Find all color cards
            const colorCards = document.querySelectorAll('.color-card');

            colorCards.forEach(card => {
                // Get hex code from the span inside color-card_color
                const hexSpan = card.querySelector('.color-card_color span');
                const hex = hexSpan ? '#' + hexSpan.textContent.trim().toUpperCase() : '';

                // Get name from color-card_name
                const nameEl = card.querySelector('.color-card_name');
                const name = nameEl ? nameEl.textContent.trim() : '';

                if (hex && name) {
                    colors.push({ name, hex });
                }
            });

            return colors;
        }''')

        await browser.close()

        # Deduplicate by hex
        seen = set()
        unique_colors = []
        for c in color_data:
            key = c.get('hex', '')
            if key and key not in seen:
                seen.add(key)
                unique_colors.append(c)

        return unique_colors


async def main():
    colors = await extract_colors()

    print(f"\nFound {len(colors)} unique colors")

    # Save to JSON file
    output_file = 'coolors-colors-extracted.json'
    with open(output_file, 'w') as f:
        json.dump(colors, f, indent=2)

    print(f"Colors saved to {output_file}")

    # Print sample
    if colors:
        print("\nFirst 20 colors:")
        for c in colors[:20]:
            print(f"  {c['name']}: {c['hex']}")


if __name__ == '__main__':
    asyncio.run(main())
