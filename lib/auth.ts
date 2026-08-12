export interface AdminUser {
  username: string;
}

const COOKIE_NAME = 'mawaqit_admin_token';

export function getTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^| )${COOKIE_NAME}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

export function hasAuthCookie(): boolean {
  return getTokenFromCookie() !== null;
}

export function getAuthHeader(): Record<string, string> {
  const token = getTokenFromCookie();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function isAuthenticated(): boolean {
  return hasAuthCookie();
}