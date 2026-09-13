const CONTENT_PREFIXES = ['/blog', '/guide', '/mountains', '/list', '/tags'] as const

export function isMonetizablePath(pathname: string): boolean {
  if (pathname === '/') return true
  return CONTENT_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`))
}
