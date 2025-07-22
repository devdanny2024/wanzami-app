import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function is the middleware
export function middleware(request: NextRequest) {
  const idToken = request.cookies.get('IdToken')?.value;
  const { pathname } = request.nextUrl;

  // Define which routes are only for logged-in users
  const protectedRoutes = ['/account', '/watchlist', '/discover'];
  
  // Define routes that logged-in users should NOT be able to access
  const publicOnlyRoutes = ['/login', '/register', '/'];

  const isAccessingProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );

  const isAccessingPublicOnlyRoute = publicOnlyRoutes.includes(pathname);

  // If user is not logged in and tries to access a protected route, redirect to login
  if (isAccessingProtectedRoute && !idToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is logged in and tries to access the welcome, login, or register page, redirect to discover
  if (idToken && isAccessingPublicOnlyRoute) {
    return NextResponse.redirect(new URL('/discover', request.url));
  }

  // Otherwise, allow the request to proceed
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
