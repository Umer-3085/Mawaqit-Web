'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { createContext, useContext } from 'react';
import { cn } from '@/components/ui/utils';
import { Lock } from 'lucide-react';
import { hasAuthCookie } from '../../lib/auth';
import { useState, useEffect } from 'react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: 'Prayer Times',
    href: '/prayer-times',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: 'Quran',
    href: '/quran',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    label: 'Zakat Calculator',
    href: '/zakat',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 11h.01M4 11h.01M12 8h.01M15 8h.01M9 8h.01M6 8h.01M3 8h.01" />
      </svg>
    ),
  },
  {
    label: 'Library',
    href: '/library',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
];

const MobileDrawerContext = createContext<{
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
} | null>(null);

export function MobileDrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-mobile-drawer', handleOpen);
    return () => window.removeEventListener('open-mobile-drawer', handleOpen);
  }, []);

  return (
    <MobileDrawerContext.Provider value={{ isOpen, openDrawer, closeDrawer }}>
      {children}
      <MobileDrawer />
    </MobileDrawerContext.Provider>
  );
}

function useMobileDrawer() {
  const context = useContext(MobileDrawerContext);
  if (!context) {
    throw new Error('useMobileDrawer must be used within MobileDrawerProvider');
  }
  return context;
}

function MobileDrawer() {
  const { isOpen, closeDrawer } = useMobileDrawer();
  const pathname = usePathname();
  const isAdmin = hasAuthCookie();

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={closeDrawer}
        aria-hidden="true"
      />
      <div
        className="fixed right-0 top-0 z-50 w-80 max-w-[85vw] h-full bg-surface-elevated border-l border-border shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <span className="text-lg font-semibold text-text">Navigation</span>
            <button
              onClick={() => closeDrawer()}
              className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => closeDrawer()}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-text-muted hover:text-primary hover:bg-surface'
                  )}
                >
                  <span className="flex items-center justify-center w-6 h-6">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {!pathname.startsWith('/admin') && (
              <Link
                key="/admin/login"
                href={isAdmin ? "/admin/dashboard" : "/admin/login"}
                onClick={() => closeDrawer()}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
                  'text-text-muted hover:text-primary hover:bg-surface'
                )}
              >
                <span className="flex items-center justify-center w-6 h-6">
                  <Lock className="w-5 h-5" aria-hidden="true" />
                </span>
                <span>{isAdmin ? "Admin Dashboard" : "Admin Login"}</span>
              </Link>
            )}
          </nav>

          {/* Theme Toggle in Drawer */}
          <div className="p-4 border-t border-border">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const isAdmin = hasAuthCookie();

  return (
    <MobileDrawerProvider>
      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Wordmark - Left */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 rounded-lg p-1 flex-shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg group-hover:bg-primary group-hover:text-white transition-colors duration-200">
              ☪
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-lg leading-none tracking-tight text-text flex items-center gap-1.5">
                Mawaqit
                <span className="font-arabic text-primary text-base font-semibold" dir="rtl">
                  مواقيت
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Right */}
          <nav className="hidden md:flex items-center gap-1.5 sm:gap-2 flex-1 justify-end">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 text-sm font-medium rounded-lg transition-colors duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-text-muted hover:text-primary hover:bg-surface'
                  )}
                >
                  <span className="flex items-center justify-center">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
            {!pathname.startsWith('/admin') && (
              <Link
                href={isAdmin ? "/admin/dashboard" : "/admin/login"}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 text-sm font-medium rounded-lg transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
                  'text-text-muted hover:text-primary hover:bg-surface'
                )}
                aria-label={isAdmin ? "Admin Dashboard" : "Admin login"}
                title={isAdmin ? "Admin Dashboard" : "Admin Login"}
              >
                <Lock className="w-4.5 h-4.5 animate-pulse-lime" aria-hidden="true" />
                <span className="hidden sm:inline">{isAdmin ? "Admin Dashboard" : "Admin"}</span>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('open-mobile-drawer'));
              }
            }}
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Theme Toggle - Far Right */}
          <ThemeToggle />
        </div>
      </header>
    </MobileDrawerProvider>
  );
}