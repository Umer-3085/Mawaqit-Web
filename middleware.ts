import { NextResponse } from 'next/server';

// This is a stub middleware for future authentication implementation
// Currently allows all requests through

export function middleware() {
  // For now, allow all requests
  // In the future, add authentication checks here
  // Example:
  // const token = request.cookies.get('auth-token');
  // if (!token && request.nextUrl.pathname.startsWith('/admin')) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};