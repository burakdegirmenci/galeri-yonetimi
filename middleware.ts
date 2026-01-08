import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value

  console.log('[Middleware]', request.nextUrl.pathname, 'Token:', token ? 'EXISTS' : 'MISSING')

  // Protect /panel routes - only check if token exists
  // Full verification will be done server-side in layout
  if (request.nextUrl.pathname.startsWith('/panel')) {
    if (!token) {
      console.log('[Middleware] No token, redirecting to /giris')
      return NextResponse.redirect(new URL('/giris', request.url))
    }
    console.log('[Middleware] Token exists, allowing access')
  }

  // Redirect to panel if already logged in and trying to access login/register
  if (
    (request.nextUrl.pathname === '/giris' ||
      request.nextUrl.pathname === '/kayit') &&
    token
  ) {
    console.log('[Middleware] Has token, redirecting to /panel')
    return NextResponse.redirect(new URL('/panel', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/panel/:path*', '/giris', '/kayit'],
}
