import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  const isLoginPage = req.nextUrl.pathname === '/admin/login' || req.nextUrl.pathname === '/admin/setup';
  const secretKey = process.env.JWT_SECRET;

  let isValid = false;
  if (token && secretKey) {
    try {
      const secret = new TextEncoder().encode(secretKey);
      const { payload } = await jwtVerify(token, secret);
      if (payload && payload.id) {
        isValid = true;
      }
    } catch {
      isValid = false;
    }
  }

  // If user is already authenticated and visits /admin/login, redirect to /admin dashboard
  if (req.nextUrl.pathname === '/admin/login' && isValid) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

  // If user is not authenticated and tries to visit protected /admin pages, redirect to /admin/login
  if (!isLoginPage && !isValid) {
    const loginUrl = new URL('/admin/login', req.url);
    const response = NextResponse.redirect(loginUrl);
    if (token) {
      response.cookies.delete('admin_token');
    }
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
