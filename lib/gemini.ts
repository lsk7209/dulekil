/**
 * P3 — Gemini API 클라이언트
 * 모델: gemini-2.0-flash (기본), 분당 60req 레이트 가드
 */

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta'
const MODEL = 'gemini-2.0-flash'

// 분당 60req 레이트 가드
let requestCount = 0
let windowStart  = Date.now()

async function rateguard() {
  const now = Date.now()
  if (now - windowStart > 60_000) {
    requestCount = 0
    windowStart  = now
  }
  if (requestCount >= 58) {
    const wait = 61_000 - (now - windowStart)
    await new Promise(r => setTimeout(r, wait))
    requestCount = 0
    windowStart  = Date.now()
  }
  requestCount++
}

export interface GeminiOpts {
  temperature?: number
  maxTokens?:  number
}

export async function generate(prompt: string, opts: GeminiOpts = {}): Promise<string> {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('GEMINI_API_KEY 환경변수 없음')

  await rateguard()

  const res = await fetch(
    `${GEMINI_API_BASE}/models/${MODEL}:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature:     opts.temperature ?? 0.7,
          maxOutputTokens: opts.maxTokens   ?? 1024,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
        ],
      }),
    }
  )

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Gemini ${res.status}: ${body.slice(0, 200)}`)
  }

  const json = await res.json() as {
    candidates: { content: { parts: { text: string }[] } }[]
  }
  return json.candidates[0]?.content?.parts[0]?.text ?? ''
}
