export interface AdminUser {
  username: string;
}

const COOKIE_NAME = 'mawaqit_admin_token';
const SESSION_COOKIE_NAME = 'mawaqit_admin_session';

export function getTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^| )${COOKIE_NAME}=([^;]+)`));
  return match?.[2] ? decodeURIComponent(match[2]) : null;
}

export function hasAuthCookie(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie
    .split(';')
    .some((part) => part.trim().startsWith(`${SESSION_COOKIE_NAME}=`));
}

export function getAuthHeader(): Record<string, string> {
  const token = getTokenFromCookie();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function isAuthenticated(): boolean {
  return hasAuthCookie();
}
