'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { apiClient } from '@/api';
import { hasAuthCookie } from '@/auth';

interface AuthContextType {
  user: { username: string } | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);
const USERNAME_KEY = 'admin_username';

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUserState] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const storedUsername = localStorage.getItem(USERNAME_KEY);
      if (hasAuthCookie()) {
        setUserState({ username: storedUsername ?? 'Admin' });
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => {
      const hadSession = localStorage.getItem(USERNAME_KEY) !== null;
      localStorage.removeItem(USERNAME_KEY);
      setUserState(null);
      if (hadSession && pathname !== '/admin/login') {
        router.push('/admin/login?expired=1');
      }
    };
    window.addEventListener('admin:session-expired', handleSessionExpired);
    return () => window.removeEventListener('admin:session-expired', handleSessionExpired);
  }, [router, pathname]);

  const login = async (username: string, password: string) => {
    try {
      await apiClient.adminLogin(username, password);
      localStorage.setItem(USERNAME_KEY, username);
      setUserState({ username });
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      const apiUrl = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:8000/api';
      await fetch(`${apiUrl}/admin/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // Ignore logout errors
    }
    localStorage.removeItem(USERNAME_KEY);
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}