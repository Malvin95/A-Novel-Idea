import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for NextAuth routes to avoid interfering with the OAuth callback
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Define public routes that don't require authentication
  const publicRoutes = ["/login", "/register"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Define protected routes that require authentication
  const protectedRoutes = ["/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Get the authentication token from cookies. Support legacy `auth-token` plus NextAuth cookies.
  const authToken = request.cookies.get("auth-token")?.value;
  
  // NextAuth may chunk large session cookies, check for main cookie or any chunks
  const nextAuthCookie = request.cookies.get("next-auth.session-token")?.value 
    || request.cookies.get("__Secure-next-auth.session-token")?.value
    || request.cookies.get("next-auth.session-token.0")?.value
    || request.cookies.get("__Secure-next-auth.session-token.0")?.value;
  
  const isAuthenticated = !!(authToken || nextAuthCookie);

  // If user is not authenticated and trying to access a protected route
  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL("/login", request.url);
    // Add the original URL as a redirect parameter
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Note: We explicitly handle /api/auth exclusion in the middleware function
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

