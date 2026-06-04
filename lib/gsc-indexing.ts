import { google } from 'googleapis'

const SCOPES = ['https://www.googleapis.com/auth/indexing']

function getAuth() {
  const key = process.env.GSC_SERVICE_ACCOUNT_KEY
  if (!key) throw new Error('GSC_SERVICE_ACCOUNT_KEY not set')
  const creds = typeof key === 'string' ? JSON.parse(key) : key
  return new google.auth.GoogleAuth({ credentials: creds, scopes: SCOPES })
}

export async function notifyGoogleIndexing(urls: string[]): Promise<void> {
  if (!process.env.GSC_SERVICE_ACCOUNT_KEY || urls.length === 0) return

  try {
    const auth    = getAuth()
    const client  = await auth.getClient()
    const token   = await (client as any).getAccessToken()
    const bearer  = token.token

    await Promise.allSettled(urls.map(url =>
      fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${bearer}` },
        body:    JSON.stringify({ url, type: 'URL_UPDATED' }),
      }).then(async r => {
        console.log(`[GSC] ${url} → ${r.status}`)
      })
    ))
  } catch (e) {
    console.error('[GSC] Indexing API 오류:', e)
  }
}
