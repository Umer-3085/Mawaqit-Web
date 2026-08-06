'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useLocation } from '@/hooks/useLocation';
import { cn } from '@/components/ui/utils';

export function Header() {
  const pathname = usePathname();
  const { location, hydrated } = useLocation();

  const isTodayActive = pathname === '/prayer-times' || pathname === '/';
  const isRangeActive = pathname?.startsWith('/prayer-times/range');

  const locationLabel = hydrated && location?.cityName
    ? `${location.cityName}, ${location.timezone.split('/')[1]?.replace(/_/g, ' ') || location.timezone.split('/')[0]}`
    : location?.timezone
      ? location.timezone.split('/')[1]?.replace(/_/g, ' ') || location.timezone
      : null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-lg p-1 -ml-1"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-base sm:text-lg shadow-sm group-hover:shadow-md transition-all duration-200">
            ☪
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base sm:text-lg leading-none tracking-tight text-text flex items-center gap-1.5">
              Mawaqit
              <span className="font-arabic text-primary text-sm sm:text-base font-semibold hidden sm:inline" dir="rtl">
                مواقيت
              </span>
            </span>
            <span className="text-[10px] text-text-muted font-medium tracking-wide hidden sm:block">
              Prayer Times &amp; Schedules
            </span>
          </div>
        </Link>

        {/* Location Badge — center area */}
        {location && locationLabel && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-xs text-primary font-semibold max-w-[280px] truncate">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{locationLabel}</span>
          </div>
        )}

        {/* Right: Nav + Theme */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Segmented Nav */}
          <nav className="flex items-center p-0.5 bg-surface/60 border border-border/40 rounded-lg">
            <Link
              href="/prayer-times"
              className={cn(
                'px-2.5 py-1.5 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
                isTodayActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-muted hover:text-text'
              )}
            >
              Today&apos;s Times
            </Link>
            <Link
              href="/prayer-times/range"
              className={cn(
                'px-2.5 py-1.5 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
                isRangeActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-text-muted hover:text-text'
              )}
            >
              Range View
            </Link>
          </nav>

          <div className="h-5 w-px bg-border/40 mx-0.5 hidden sm:block" />

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
