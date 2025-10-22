import { NextResponse } from 'next/server';
import { verifyJWT } from './lib/jwt-edge';

export async function middleware(req: any) {
  const token = req.cookies.get?.('rf_token')?.value;
  
  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/billing', '/integrations'];
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // Verify JWT token
    try {
      const decoded = await verifyJWT(token);
      
      // Add user info to headers for API routes
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-user-id', decoded.userId);
      requestHeaders.set('x-user-email', decoded.email);
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      // Invalid or expired token
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/billing/:path*', '/integrations/:path*'],
};


