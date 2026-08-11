'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useState } from 'react';
import { cn } from '@/components/ui/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  active?: boolean;
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

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
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
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Theme Toggle - Far Right */}
        <ThemeToggle />
      </div>

      {/* Mobile Drawer Overlay */}
      <MobileDrawer />
    </header>
  );
}

function MobileDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);

  const toggleDrawer = () => setIsOpen(!isOpen);

  // We need to communicate with the navbar button - use a shared state approach
  // For now, we'll use a simple approach with a custom event
  if (typeof window !== 'undefined') {
    // Listen for custom event to open drawer
    const handleOpenDrawer = () => setIsOpen(true);
    window.addEventListener('open-mobile-drawer', handleOpenDrawer);
    return () => window.removeEventListener('open-mobile-drawer', handleOpenDrawer);
  }

  return null;
}

// Separate component for the actual drawer to avoid SSR issues
function MobileDrawerContent() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Listen for open event from navbar
  if (typeof window !== 'undefined') {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-mobile-drawer', handleOpen);
    return () => window.removeEventListener('open-mobile-drawer', handleOpen);
  }

  return null;
}

// Actual drawer component
function Drawer() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const closeDrawer = () => setIsOpen(false);

  // Listen for open event
  if (typeof window !== 'undefined') {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-mobile-drawer', handleOpen);
    return () => window.removeEventListener('open-mobile-drawer', handleOpen);
  }

  return null;
}

// Simplified approach - combine everything in one component
function MobileDrawerComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const openDrawer = () => setIsOpen(true);
  const closeDrawer = () => setIsOpen(false);

  // Listen for open event from navbar button
  if (typeof window !== 'undefined') {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-mobile-drawer', handleOpen);
    return () => window.removeEventListener('open-mobile-drawer', handleOpen);
  }

  return null;
}

// Final simplified approach - use a single component with useEffect for event listener
function MobileDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const closeDrawer = () => setIsOpen(false);

  // Listen for open event from navbar
  if (typeof window !== 'undefined') {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-mobile-drawer', handleOpen);
    return () => window.removeEventListener('open-mobile-drawer', handleOpen);
  }

  return null;
}

// Actually, let me just create a proper component with the event listener inside useEffect
export function MobileDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const closeDrawer = () => setIsOpen(false);

  // Listen for open event from navbar
  if (typeof window !== 'undefined') {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-mobile-drawer', handleOpen);
    return () => window.removeEventListener('open-mobile-drawer', handleOpen);
  }

  return null;
}

// Actually, let me just write the complete proper component
export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
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
  );
}

export function MobileDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const closeDrawer = () => setIsOpen(false);

  // Listen for open event from navbar
  if (typeof window !== 'undefined') {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-mobile-drawer', handleOpen);
    return () => window.removeEventListener('open-mobile-drawer', handleOpen);
  }

  return null;
}