import { NextResponse } from 'next/server';

const COOKIE_NAME = 'mawaqit_admin_token';

export function middleware(request: Request) {
  const { pathname } = new URL(request.url);

  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    const cookieHeader = request.headers.get('cookie') ?? '';
    const hasAuthCookie = cookieHeader.includes(`${COOKIE_NAME}=`);

    if (!hasAuthCookie) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};