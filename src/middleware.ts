import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

// Cookie-presence check only (no DB round-trip) — fast enough to run on
// every matched request. It doesn't validate the session, just gates
// whether the page is worth rendering; server actions still check the real
// session before touching any data (see auth-server.ts).
export function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/tools/:path*'],
}
