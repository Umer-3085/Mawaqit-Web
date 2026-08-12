'use client';

import { AuthProvider } from '@/components/admin/AuthProvider';
import { AdminSidebarProvider, AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopBar } from '@/components/admin/AdminTopBar';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <AuthProvider>
      <AdminSidebarProvider>
        <div className="min-h-screen bg-background flex">
          {!isLoginPage && <AdminSidebar />}
          <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
            {!isLoginPage && <AdminTopBar onMenuClick={() => {}} title={getPageTitle(pathname)} />}
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </AdminSidebarProvider>
    </AuthProvider>
  );
}

function getPageTitle(pathname: string): string {
  const titles: Record<string, string> = {
    '/admin/dashboard': 'Dashboard',
    '/admin/verses': 'Verses',
    '/admin/surahs': 'Surahs',
    '/admin/articles': 'Articles',
    '/admin/videos': 'Videos',
    '/admin/categories': 'Categories',
  };

  for (const [path, title] of Object.entries(titles)) {
    if (pathname === path || pathname.startsWith(path + '/')) {
      return title;
    }
  }
  return 'Admin';
}