import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // If the user is trying to access the login page, let them through
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Check for the dummy auth cookie
  const authCookie = request.cookies.get('admin_auth');

  // If the cookie is not present or invalid, redirect to login
  if (!authCookie || authCookie.value !== 'true') {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // If authorized, continue
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*'],
};
