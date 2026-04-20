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

    const session = await response.json();

    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // If there's an error fetching the session, default to redirecting to login
    // just to be safe, or we can let it pass and let client side handle it.
    // For strict protection, we redirect.
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
  ],
};
