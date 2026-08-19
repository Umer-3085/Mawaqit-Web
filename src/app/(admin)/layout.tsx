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
        <div className="min-h-screen bg-background bg-geometric-subtle bg-architectural-lines flex">
          {!isLoginPage && <AdminSidebar />}
          <div className="flex-1 flex flex-col min-w-0 transition-all duration-200">
            {!isLoginPage && <AdminTopBar />}
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </AdminSidebarProvider>
    </AuthProvider>
  );
}