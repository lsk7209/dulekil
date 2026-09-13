import { timingSafeEqual } from 'node:crypto'

export function isAuthorizedCronRequest(request: Request, configuredSecret = process.env.CRON_SECRET): boolean {
  if (!configuredSecret) return false
  const provided = request.headers.get('authorization')
  if (!provided?.startsWith('Bearer ')) return false
  const actual = Buffer.from(provided.slice('Bearer '.length))
  const expected = Buffer.from(configuredSecret)
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}
