import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // /learn routes use client-side InstantDB authentication
  // The AuthProvider component handles redirects for /learn routes

  return NextResponse.next();
}

export const config = {
  matcher: ['/learn/:path*'],
};