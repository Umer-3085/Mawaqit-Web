'use client';

import { useAuth } from '@/components/admin/AuthProvider';
import { useRouter } from 'next/navigation';
import { useAdminSidebar } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/Button';
import { cn } from '@/components/ui/utils';
import { Menu, LogOut, User, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface AdminTopBarProps {
  title?: string;
}

export function AdminTopBar({ title }: AdminTopBarProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const { openSidebar } = useAdminSidebar();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-4">
        {/* Left: Mobile menu button + Title */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            onClick={openSidebar}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          {title && (
            <h1 className="text-lg font-semibold text-text truncate">{title}</h1>
          )}
        </div>

        {/* Right: User menu */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
                  'text-text-muted hover:text-primary hover:bg-surface'
                )}
                onClick={() => setShowDropdown(!showDropdown)}
                aria-expanded={showDropdown}
                aria-haspopup="true"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:block">{user?.username ?? 'Admin'}</span>
                <ChevronDown className={cn('w-4 h-4 transition-transform', showDropdown && 'rotate-180')} />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-elevated border border-border rounded-lg shadow-lg py-1 z-50">
                  <div className="px-3 py-2 border-b border-border text-sm text-text-muted">
                    Signed in as
                  </div>
                  <div className="px-3 py-1 text-sm font-medium text-text">
                    {user?.username ?? 'Admin'}
                  </div>
                  <hr className="my-1 border-border" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 text-sm text-left',
                      'hover:bg-surface transition-colors',
                      'text-error hover:text-error'
                    )}
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}