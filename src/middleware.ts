import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function is the middleware
export function middleware(request: NextRequest) {
  // 1. Get the session token from the user's cookies
  const idToken = request.cookies.get('IdToken')?.value;

  // 2. Define which routes are protected
  const protectedRoutes = ['/account', '/watchlist']; // Add any other routes you want to protect

  // 3. Check if the user is trying to access a protected route
  const isAccessingProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  // 4. If they are accessing a protected route and are NOT logged in...
  if (isAccessingProtectedRoute && !idToken) {
    // ...redirect them to the login page.
    // We also add a 'next' query parameter to redirect them back after login.
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 5. If they are logged in or accessing a public route, let them proceed.
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  // This specifies that the middleware should run on all routes
  // except for a few specific ones (like API routes, static files, and images).
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
