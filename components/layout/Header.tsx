'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useLocation } from '@/hooks/useLocation';

export function Header() {
  const pathname = usePathname();
  const { location } = useLocation();

  const isTodayActive = pathname === '/prayer-times' || pathname === '/';
  const isRangeActive = pathname?.startsWith('/prayer-times/range');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-lg p-1"
        >
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg group-hover:bg-primary group-hover:text-white transition-colors duration-200">
            ☪
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none tracking-tight text-text flex items-center gap-1.5">
              Mawaqit
              <span className="font-arabic text-primary text-base font-semibold" dir="rtl">
                مواقيت
              </span>
            </span>
            <span className="text-[10px] text-text-muted font-medium tracking-wide">
              Prayer Times & Schedules
            </span>
          </div>
        </Link>

        {/* Right Navigation & Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {location && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface border border-border/50 text-xs text-text-muted font-medium">
              <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{location.timezone.split('/')[1]?.replace(/_/g, ' ') || location.timezone}</span>
            </div>
          )}

          <nav className="flex items-center gap-1.5 sm:gap-2">
            <Link
              href="/prayer-times"
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 text-sm font-medium rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ${
                isTodayActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-text hover:text-primary hover:bg-surface'
              }`}
            >
              Today&apos;s Times
            </Link>
            <Link
              href="/prayer-times/range"
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 text-sm font-medium rounded-lg transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 ${
                isRangeActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-text hover:text-primary hover:bg-surface'
              }`}
            >
              Range View
            </Link>
          </nav>

          <div className="h-5 w-px bg-border/50" />

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
