'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  showNav?: boolean;
}

export function Header({ showNav = true }: HeaderProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/generate', label: 'Generate' },
    { href: '/image-picker', label: 'Image Picker' },
    { href: '/visualizer', label: 'Visualizer' },
    { href: '/trending', label: 'Trending' },
    { href: '/palettes', label: 'Explore' },
    { href: '/color-libraries', label: 'Libraries' },
    { href: '/collage', label: 'Collage' },
  ];

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-card-border bg-background">
      <Link href="/" className="text-2xl font-bold text-foreground">
        Kolors
      </Link>
      {showNav && (
        <nav className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors ${
                  pathname === link.href || pathname?.startsWith(link.href + '/')
                    ? 'text-foreground font-medium'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <MobileMenu links={navLinks} pathname={pathname} />
          <ThemeToggle />
        </nav>
      )}
    </header>
  );
}

function MobileMenu({ links, pathname }: { links: { href: string; label: string }[]; pathname: string | null }) {
  return (
    <div className="md:hidden relative group">
      <button className="p-2 rounded-lg hover:bg-muted-bg transition-colors text-muted">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="absolute right-0 top-full mt-2 w-48 bg-card-bg border border-card-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <div className="py-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2 transition-colors ${
                pathname === link.href
                  ? 'text-foreground font-medium bg-muted-bg'
                  : 'text-muted hover:text-foreground hover:bg-muted-bg'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
