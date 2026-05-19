import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    const response = await fetch(
      new URL('/api/auth/get-session', request.url),
      {
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
        cache: 'no-store',
      },
    );

    const sessionData = await response.json();

    if (!sessionData || !sessionData.user) {
      if (request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Role-based authorization for Admin routes
    const isAdminRoute =
      request.nextUrl.pathname.startsWith('/admin') ||
      request.nextUrl.pathname.startsWith('/api/admin');

    if (isAdminRoute && sessionData.user.role !== 'admin') {
      if (request.nextUrl.pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Not Found' }, { status: 404 });
      }

      return NextResponse.rewrite(new URL('/404', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    if (request.nextUrl.pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/health-dashboard/:path*',
    '/health-assessment/:path*',
    '/marketplace/:path*',
    '/cart/:path*',
    '/profile/:path*',
    '/smart-counter/:path*',
    '/checkout/:path*',
    '/order-history/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
