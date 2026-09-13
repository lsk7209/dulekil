const PUBLIC_HOST = 'dullegilgogo.kr'
const MAX_INDEXNOW_URLS = 100

export function normalizeIndexNowUrls(input: unknown): string[] | null {
  if (!Array.isArray(input) || input.length === 0 || input.length > MAX_INDEXNOW_URLS) return null
  const normalized = new Set<string>()
  for (const value of input) {
    if (typeof value !== 'string') return null
    try {
      const url = new URL(value)
      if (url.protocol !== 'https:' || url.hostname !== PUBLIC_HOST || url.username || url.password || url.hash) return null
      normalized.add(url.toString())
    } catch {
      return null
    }
  }
  return [...normalized]
}
