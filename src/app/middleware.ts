import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const loggedIn = request.cookies.get('auth')?.value;

  const isLoginPage = request.nextUrl.pathname === '/login';
  const isRootPage = request.nextUrl.pathname === '/';

  if (!loggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (loggedIn && (isLoginPage || isRootPage)) {
    return NextResponse.redirect(new URL('/onebox', request.url));
  }

  return NextResponse.next();
}

export const config = {
    matcher: ['/', '/login', '/onebox'],
  };