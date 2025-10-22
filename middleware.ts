import { NextResponse } from 'next/server';

export function middleware(req: any) {
  const token = req.cookies.get?.('rf_token')?.value;
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};


