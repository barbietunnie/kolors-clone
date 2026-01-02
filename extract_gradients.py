#!/usr/bin/env python3
"""
Extract gradients from coolors.co/gradients using Playwright
Author: Babatunde Adeyemi
"""

import json
import asyncio
from playwright.async_api import async_playwright


async def extract_gradients():
    """Extract all gradients from coolors.co/gradients page."""

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        )
        page = await context.new_page()

        print("Navigating to coolors.co/gradients...")
        await page.goto('https://coolors.co/gradients', wait_until='domcontentloaded', timeout=60000)

        # Wait for the page to stabilize
        await asyncio.sleep(5)

        # Close any popup modals by pressing Escape
        try:
            await page.keyboard.press('Escape')
            await asyncio.sleep(1)
        except:
            pass

        # Scroll to load all gradients - more gradients load as user scrolls
        print("Scrolling to load all gradients (this loads more gradients dynamically)...")
        previous_count = 0
        no_change_count = 0

        for i in range(200):  # More scrolls to load all gradients
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)')
            await asyncio.sleep(0.8)

            # Check current gradient count
            current_count = await page.evaluate('document.querySelectorAll(".gradient-card").length')

            if i % 10 == 0:
                print(f"  Scroll {i+1}: {current_count} gradients loaded...")

            if current_count == previous_count:
                no_change_count += 1
                if no_change_count >= 8:  # Stop if no new gradients for 8 scrolls
                    print(f"  No new gradients loaded. Stopping scroll.")
                    break
            else:
                no_change_count = 0

            previous_count = current_count

        print(f"Total gradient cards found: {previous_count}")

        # Extract gradients using the discovered class structure
        print("Extracting gradient data...")
        gradient_data = await page.evaluate('''() => {
            const gradients = [];

            // Find all gradient cards
            const gradientCards = document.querySelectorAll('.gradient-card');

            gradientCards.forEach((card, index) => {
                try {
                    // Get gradient from the background element
                    const bgEl = card.querySelector('.gradient-card_bg') ||
                                 card.querySelector('.gradient-card_bg_colors');

                    let gradientCss = '';
                    if (bgEl) {
                        gradientCss = window.getComputedStyle(bgEl).backgroundImage;
                    }

                    // Fallback: check the card itself
                    if (!gradientCss || !gradientCss.includes('gradient')) {
                        gradientCss = window.getComputedStyle(card).backgroundImage;
                    }

                    // Get name from gradient-card_name
                    const nameEl = card.querySelector('.gradient-card_name');
                    const name = nameEl ? nameEl.textContent.trim() : '';

                    // Extract colors from gradient CSS
                    const colors = [];
                    if (gradientCss) {
                        // Match rgb/rgba colors and convert to hex
                        const rgbMatches = gradientCss.match(/rgba?\\([^)]+\\)/g);
                        if (rgbMatches) {
                            rgbMatches.forEach(rgb => {
                                const nums = rgb.match(/\\d+/g);
                                if (nums && nums.length >= 3) {
                                    const hex = '#' + nums.slice(0, 3).map(n => {
                                        const h = parseInt(n).toString(16);
                                        return h.length === 1 ? '0' + h : h;
                                    }).join('').toUpperCase();
                                    colors.push(hex);
                                }
                            });
                        }

                        // Also match hex colors directly
                        const hexMatches = gradientCss.match(/#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g);
                        if (hexMatches) {
                            colors.push(...hexMatches.map(c => c.toUpperCase()));
                        }
                    }

                    // Get link from view button or parent
                    let link = '';
                    const viewBtn = card.querySelector('.gradient-card_view-btn');
                    if (viewBtn && viewBtn.href) {
                        link = viewBtn.href;
                    }

                    if (gradientCss && gradientCss.includes('gradient')) {
                        gradients.push({
                            name: name || `Gradient ${index + 1}`,
                            css: gradientCss,
                            colors: [...new Set(colors)],  // Remove duplicates
                            link: link
                        });
                    }
                } catch (e) {
                    // Skip errors
                }
            });

            return gradients;
        }''')

        await browser.close()

        # Deduplicate by CSS
        seen = set()
        unique_gradients = []
        for g in gradient_data:
            key = g.get('css', '')
            if key and key not in seen:
                seen.add(key)
                unique_gradients.append(g)

        return unique_gradients


async def main():
    gradients = await extract_gradients()

    print(f"\nFound {len(gradients)} unique gradients")

    # Save to JSON file
    output_file = 'gradients-extracted.json'
    with open(output_file, 'w') as f:
        json.dump(gradients, f, indent=2)

    print(f"Gradients saved to {output_file}")

    # Print sample
    if gradients:
        print("\nFirst 10 gradients:")
        for g in gradients[:10]:
            colors_str = ', '.join(g.get('colors', [])[:4])
            print(f"  {g['name']}: {colors_str}")


if __name__ == '__main__':
    asyncio.run(main())
