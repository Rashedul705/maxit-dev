import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If the user is authenticated and trying to access the login page, redirect them to the admin dashboard
    if (req.nextUrl.pathname === "/admin/login" && req.nextauth.token) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // The /admin/login and /admin/setup pages should be accessible to everyone (no token required)
        if (req.nextUrl.pathname === "/admin/login" || req.nextUrl.pathname === "/admin/setup") {
          return true;
        }
        // All other /admin routes require a valid token
        return !!token;
      },
    },
    pages: {
      signIn: "/admin/login",
    }
  }
);

// Apply this middleware to everything under /admin
export const config = {
  matcher: ["/admin/:path*"],
};
