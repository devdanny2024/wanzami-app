/*
 * FILE: src/middleware.ts
 *
 * INSTRUCTIONS: This middleware has been updated with console.log statements
 * for debugging the admin route protection.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const idToken = request.cookies.get('IdToken')?.value;
  const { pathname, searchParams } = request.nextUrl;

  // --- Admin Route Protection ---
  if (pathname.startsWith('/admin')) {
    const secretFromUrl = searchParams.get('secret');
    const serverSecret = process.env.ADMIN_SECRET_KEY;

    // --- DEBUGGING LOGS ---
    // These will appear in the terminal where you run `npm run dev`
    console.log("--- Admin Access Attempt ---");
    console.log("Secret from URL:", secretFromUrl);
    console.log("Secret from .env:", serverSecret);
    console.log("Do they match?:", secretFromUrl === serverSecret);
    console.log("--------------------------");
    
    if (secretFromUrl !== serverSecret) {
      // If the secret is missing or incorrect, redirect to the homepage.
      return NextResponse.redirect(new URL('/', request.url));
    }
    // If the secret is correct, allow access to the admin page.
    return NextResponse.next();
  }

  // --- User Authentication Rules ---
  const protectedRoutes = ['/account', '/watchlist', '/discover'];
  const publicOnlyRoutes = ['/login', '/register', '/'];

  const isAccessingProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );
  const isAccessingPublicOnlyRoute = publicOnlyRoutes.includes(pathname);

  if (isAccessingProtectedRoute && !idToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (idToken && isAccessingPublicOnlyRoute) {
    return NextResponse.redirect(new URL('/discover', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
