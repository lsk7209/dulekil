import { NextRequest, NextResponse } from 'next/server'

const READ_ORIGIN = 'https://dulekil-site.item79.com'

export const config = {
  matcher: ['/mountains', '/mountains/:path*'],
}

export function middleware(request: NextRequest) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return NextResponse.next()
  const url = request.nextUrl
  return NextResponse.rewrite(new URL(url.pathname + url.search, READ_ORIGIN))
}
