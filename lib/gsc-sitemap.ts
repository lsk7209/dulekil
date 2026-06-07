import { google } from 'googleapis'

const SCOPES = ['https://www.googleapis.com/auth/webmasters']

const DEFAULT_SITE_URL = 'https://dullegilgogo.kr/'
const DEFAULT_SITEMAP_URL = 'https://dullegilgogo.kr/sitemap.xml'
const POLL_DELAY_MS = 5000
const POLL_ATTEMPTS = 8

export type GscSitemapStatus = {
  path: string
  lastSubmitted?: string
  lastDownloaded?: string
  isPending?: boolean
  isSitemapsIndex?: boolean
  warnings?: string
  errors?: string
  ok: boolean
}

function getAuth() {
  const key = process.env.GSC_SERVICE_ACCOUNT_KEY
  if (!key) throw new Error('GSC_SERVICE_ACCOUNT_KEY not set')

  const credentials = JSON.parse(key)
  return new google.auth.GoogleAuth({ credentials, scopes: SCOPES })
}

function normalizeStatus(sitemap: any): GscSitemapStatus {
  const warnings = String(sitemap.warnings ?? '0')
  const errors = String(sitemap.errors ?? '0')
  const isPending = sitemap.isPending === true

  return {
    path: sitemap.path,
    lastSubmitted: sitemap.lastSubmitted,
    lastDownloaded: sitemap.lastDownloaded,
    isPending,
    isSitemapsIndex: sitemap.isSitemapsIndex,
    warnings,
    errors,
    ok: errors === '0' && warnings === '0' && !isPending,
  }
}

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function submitAndVerifyGscSitemap(
  siteUrl = DEFAULT_SITE_URL,
  sitemapUrl = DEFAULT_SITEMAP_URL
): Promise<GscSitemapStatus> {
  const auth = getAuth()
  const service = google.webmasters({ version: 'v3', auth })

  await service.sitemaps.submit({ siteUrl, feedpath: sitemapUrl })

  let status: GscSitemapStatus | undefined
  for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt += 1) {
    const result = await service.sitemaps.get({ siteUrl, feedpath: sitemapUrl })
    status = normalizeStatus(result.data)
    if (status.ok) return status
    if (attempt < POLL_ATTEMPTS - 1) await wait(POLL_DELAY_MS)
  }

  if (!status) throw new Error('GSC sitemap status unavailable')
  return status
}
