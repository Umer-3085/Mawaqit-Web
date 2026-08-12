'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { apiClient } from '@/lib/api';
import { getToken, getUser, setToken, setUser, clearToken, isAuthenticated } from '@/lib/auth';

interface AuthContextType {
  token: string | null;
  user: { username: string } | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const storedToken = getToken();
      const storedUser = getUser();
      setTokenState(storedToken);
      setUserState(storedUser);
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await apiClient.adminLogin(username, password);
      const { access_token } = response;
      setToken(access_token);
      const userObj = { username };
      setUser(userObj);
      setTokenState(access_token);
      setUserState(userObj);
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    clearToken();
    setTokenState(null);
    setUserState(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout, isAuthenticated: !!token }}>
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