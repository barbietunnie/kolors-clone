'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';

// Main tools - only implemented pages with Coolors-style colors
const mainTools = [
  {
    name: 'Palette Generator',
    href: '/generate',
    description: 'Create unique color palettes quickly and effortlessly.',
    titleColor: 'text-[#5B9FED]',
    hoverBg: 'hover:bg-[#5B9FED]/10',
  },
  {
    name: 'Explore Palettes',
    href: '/palettes',
    description: 'Discover millions of color palettes by topic, style and color.',
    titleColor: 'text-[#8B5CF6]',
    hoverBg: 'hover:bg-[#8B5CF6]/10',
  },
  {
    name: 'Image Picker',
    href: '/image-picker',
    description: 'Extract beautiful colors from any image with ease.',
    titleColor: 'text-[#F97066]',
    hoverBg: 'hover:bg-[#F97066]/10',
  },
  {
    name: 'Contrast Checker',
    href: '/contrast-checker',
    description: 'Ensure your designs meet accessibility standards.',
    titleColor: 'text-[#EF4444]',
    hoverBg: 'hover:bg-[#EF4444]/10',
  },
  {
    name: 'Palette Visualizer',
    href: '/visualizer',
    description: 'Check your colors on real designs in real-time.',
    titleColor: 'text-[#EC4899]',
    hoverBg: 'hover:bg-[#EC4899]/10',
  },
  {
    name: 'Color Picker',
    href: '/color-picker',
    description: 'Get useful info about any color like meaning, variations and accessibility.',
    titleColor: 'text-[#F59E0B]',
    hoverBg: 'hover:bg-[#F59E0B]/10',
  },
];

// Additional tools - only implemented pages
const moreTools = [
  { name: 'Color Libraries', href: '/color-libraries' },
  { name: 'Gradient Maker', href: '/gradient-maker' },
  { name: 'Collage Maker', href: '/collage-maker' },
  { name: 'Browse Gradients', href: '/gradients' },
  { name: 'List of Colors', href: '/colors' },
];

export function Header() {
  const pathname = usePathname();
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isActive = useCallback((href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsToolsOpen(false);
  }, [pathname]);

  // Handle hover with delay for better UX
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsToolsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsToolsOpen(false);
    }, 150);
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-card-border backdrop-blur-sm bg-opacity-95">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 h-16">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl md:text-2xl font-bold text-foreground hover:opacity-80 transition-opacity"
        >
          Kolors
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {/* Tools Dropdown */}
          <div
            className="relative"
            ref={dropdownRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => setIsToolsOpen(!isToolsOpen)}
              className={`
                flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full
                transition-all duration-200
                ${isToolsOpen || mainTools.some(t => isActive(t.href)) || moreTools.some(t => isActive(t.href))
                  ? 'text-foreground bg-muted-bg'
                  : 'text-muted hover:text-foreground hover:bg-muted-bg'
                }
              `}
              aria-expanded={isToolsOpen}
              aria-haspopup="true"
            >
              <span>Tools</span>
              <motion.svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{ rotate: isToolsOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </button>

            {/* Mega Menu Dropdown */}
            <AnimatePresence>
              {isToolsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute top-full right-0 mt-2 w-[600px] bg-card-bg rounded-2xl shadow-2xl border border-card-border overflow-hidden"
                  style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <div className="p-6">
                    {/* Main Tools Grid */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                      {mainTools.map((tool) => (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          className={`
                            group block p-4 -mx-4 rounded-2xl transition-all duration-200
                            ${tool.hoverBg}
                          `}
                        >
                          <h3 className={`text-2xl font-bold ${tool.titleColor} mb-1`}>
                            {tool.name}
                          </h3>
                          <p className="text-sm text-muted leading-relaxed">
                            {tool.description}
                          </p>
                        </Link>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className="my-4 border-t border-card-border" />

                    {/* More Tools Section */}
                    <div>
                      <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                        Discover
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {moreTools.map((tool) => (
                          <Link
                            key={tool.href}
                            href={tool.href}
                            className={`
                              px-3 py-1.5 text-sm rounded-full transition-all duration-200
                              ${isActive(tool.href)
                                ? 'bg-foreground text-background'
                                : 'text-muted hover:text-foreground hover:bg-muted-bg'
                              }
                            `}
                          >
                            {tool.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Trending Link with fire icon */}
          <Link
            href="/trending"
            className={`
              flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full
              transition-all duration-200
              ${isActive('/trending')
                ? 'text-foreground bg-muted-bg'
                : 'text-muted hover:text-foreground hover:bg-muted-bg'
              }
            `}
          >
            <svg className="w-4 h-4 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            <span>Trending</span>
          </Link>

          {/* Divider */}
          <div className="w-px h-5 bg-card-border mx-2" />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Start Generator CTA */}
          <Link
            href="/generate"
            className="
              ml-2 px-5 py-2 text-sm font-medium text-white
              bg-gray-900 dark:bg-white dark:text-gray-900
              rounded-full hover:opacity-90
              transition-all duration-200 hover:shadow-lg
              active:scale-95
            "
          >
            Start Generator
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-muted hover:text-foreground hover:bg-muted-bg rounded-lg transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <motion.div
              animate={isMobileMenuOpen ? "open" : "closed"}
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </motion.div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="md:hidden border-t border-card-border bg-card-bg overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {/* Main Tools Section */}
              <div className="text-xs font-semibold text-muted uppercase tracking-wider px-3 py-2">
                Tools
              </div>
              {mainTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    block px-3 py-3 rounded-xl transition-all duration-200
                    ${tool.hoverBg} active:bg-muted-bg
                  `}
                >
                  <h3 className={`text-xl font-bold ${tool.titleColor} mb-0.5`}>
                    {tool.name}
                  </h3>
                  <p className="text-sm text-muted">
                    {tool.description}
                  </p>
                </Link>
              ))}

              {/* More Tools */}
              <div className="border-t border-card-border my-3 pt-3">
                <div className="text-xs font-semibold text-muted uppercase tracking-wider px-3 py-2">
                  Discover
                </div>
                {moreTools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                      ${isActive(tool.href)
                        ? 'bg-muted-bg text-foreground'
                        : 'text-muted hover:text-foreground hover:bg-muted-bg'
                      }
                    `}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                    <span className="font-medium text-sm">{tool.name}</span>
                  </Link>
                ))}
              </div>

              {/* Trending */}
              <div className="border-t border-card-border my-3 pt-3">
                <Link
                  href="/trending"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                    ${isActive('/trending')
                      ? 'bg-muted-bg'
                      : 'hover:bg-muted-bg'
                    }
                  `}
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                    <svg className="w-5 h-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground">Trending Palettes</div>
                    <div className="text-xs text-muted">Popular palettes from Coolors</div>
                  </div>
                </Link>
              </div>

              {/* CTA Button */}
              <div className="pt-3 px-3">
                <Link
                  href="/generate"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="
                    flex items-center justify-center w-full px-4 py-3
                    text-sm font-medium text-white
                    bg-gray-900 dark:bg-white dark:text-gray-900
                    rounded-xl hover:opacity-90
                    transition-all duration-200 active:scale-[0.98]
                  "
                >
                  Start the Generator
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
