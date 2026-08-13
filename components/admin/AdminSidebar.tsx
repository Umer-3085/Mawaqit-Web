'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createContext, useContext, useState, ReactNode } from 'react';
import { cn } from '@/components/ui/utils';
import {
  Home,
  BookOpen,
  Book,
  Languages,
  BookOpenText,
  FileText,
  Video,
  FolderTree,
  X,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <Home className="w-5 h-5" /> },
  { label: 'Verses', href: '/admin/verses', icon: <BookOpen className="w-5 h-5" /> },
  { label: 'Surahs', href: '/admin/surahs', icon: <Book className="w-5 h-5" /> },
  { label: 'Translations', href: '/admin/translations', icon: <Languages className="w-5 h-5" /> },
  { label: 'Tafsir', href: '/admin/tafsir', icon: <BookOpenText className="w-5 h-5" /> },
  { label: 'Articles', href: '/admin/articles', icon: <FileText className="w-5 h-5" /> },
  { label: 'Videos', href: '/admin/videos', icon: <Video className="w-5 h-5" /> },
  { label: 'Categories', href: '/admin/categories', icon: <FolderTree className="w-5 h-5" /> },
];

interface SidebarContextType {
  isOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | null>(null);

export function AdminSidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        openSidebar: () => setIsOpen(true),
        closeSidebar: () => setIsOpen(false),
        toggleSidebar: () => setIsOpen((prev) => !prev),
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within AdminSidebarProvider');
  }
  return context;
}

export function AdminSidebar({ isMobileOpen, onClose }: { isMobileOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const { isOpen, closeSidebar } = useSidebar();
  const sidebarOpen = isMobileOpen ?? isOpen;
  const handleClose = onClose ?? closeSidebar;

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          'fixed lg:sticky lg:top-0 lg:h-screen z-45 w-64 bg-surface-elevated border-r border-border flex flex-col transition-transform duration-200 ease-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        role="navigation"
        aria-label="Admin navigation"
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-border">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                ☪
              </div>
              <span className="font-bold text-lg text-text hidden sm:block">Mawaqit Admin</span>
            </Link>
            <button
              onClick={handleClose}
              className="lg:hidden p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20',
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-text-muted hover:text-primary hover:bg-surface'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className="flex items-center justify-center w-5 h-5">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <p className="text-xs text-text-muted text-center">
              Admin Panel v0.1.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

export function useAdminSidebar() {
  return useSidebar();
}