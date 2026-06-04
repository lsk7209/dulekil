const HOST = 'dullegilgogo.kr'
const BASE = `https://${HOST}`

export async function notifyIndexNow(urls: string[]): Promise<void> {
  const key = process.env.INDEXNOW_KEY
  if (!key || urls.length === 0) return

  const payload = {
    host:        HOST,
    key,
    keyLocation: `${BASE}/${key}.txt`,
    urlList:     urls,
  }

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body:    JSON.stringify(payload),
    })
    console.log(`[IndexNow] ${urls.length}개 전송 → HTTP ${res.status}`)
  } catch (e) {
    console.error('[IndexNow] 전송 실패:', e)
  }
}
