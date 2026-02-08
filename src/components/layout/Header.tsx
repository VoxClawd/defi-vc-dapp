'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/hooks/useTheme';

const navItems = [
  { href: '/', label: 'Stage' },
  { href: '/about', label: 'About' },
  { href: '/portfolio', label: 'Portfolio' },
];

export function Header() {
  const pathname = usePathname();
  const { style, toggleStyle } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-xl font-bold">
            ◈
          </div>
          <span className="text-xl font-bold text-white">DeFi VC</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Theme Toggle */}
        <button
          onClick={toggleStyle}
          className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
        >
          {style === 'pixel' ? (
            <>
              <span className="text-lg">👾</span>
              <span>Pixel</span>
            </>
          ) : (
            <>
              <span className="text-lg">✨</span>
              <span>Modern</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
