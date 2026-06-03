/**
 * T2 — 결측률 분석
 * GeoJSON에서 500건 샘플 → 난이도/거리/소요시간 3필드 채움률 집계
 * 킬 기준: 채움률 < 60%
 */

import AdmZip from 'adm-zip'
import iconv from 'iconv-lite'
import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(__dirname, '../..')
const MOUNTAIN_ZIP = path.join(ROOT, 'docs', 'mountain.zip')
const OUTPUT_DIR = path.join(ROOT, 'scripts', 'phase05')

const KILL_THRESHOLD = 0.60
const SAMPLE_TARGET = 500

interface TrailRecord {
  MNTN_NM: string
  PMNTN_NM: string
  PMNTN_DFFL: string   // 난이도
  PMNTN_LT: number     // 거리(km)
  PMNTN_UPPL: number   // 상행 소요시간(분)
  PMNTN_GODN: number   // 하행 소요시간(분)
}

function isPresent(val: unknown): boolean {
  if (val === null || val === undefined) return false
  if (typeof val === 'string') return val.trim() !== '' && val.trim() !== ' '
  if (typeof val === 'number') return val > 0
  return Boolean(val)
}

function readGeoJsonTrails(buf: Buffer): TrailRecord[] {
  const text = buf.toString('utf-8')
  const json = JSON.parse(text)
  const features: unknown[] = json.features || []
  return features.map((f: unknown) => {
    const attr = (f as { attributes: Record<string, unknown> }).attributes || {}
    return {
      MNTN_NM:    String(attr['MNTN_NM']    || ''),
      PMNTN_NM:   String(attr['PMNTN_NM']   || ''),
      PMNTN_DFFL: String(attr['PMNTN_DFFL'] || ''),
      PMNTN_LT:   Number(attr['PMNTN_LT']   || 0),
      PMNTN_UPPL: Number(attr['PMNTN_UPPL'] || 0),
      PMNTN_GODN: Number(attr['PMNTN_GODN'] || 0),
    }
  })
}

export interface FillRateResult {
  total_sampled: number
  difficulty_fill: number    // PMNTN_DFFL
  distance_fill: number      // PMNTN_LT
  uphill_time_fill: number   // PMNTN_UPPL
  downhill_time_fill: number // PMNTN_GODN
  any_time_fill: number      // UPPL or GODN > 0
  kill: boolean
  kill_reason?: string
  difficulty_values: Record<string, number>
  sample_mountains: string[]
}

async function main(): Promise<FillRateResult> {
  console.log('[T2] 결측률 분석 시작...')
  const outer = new AdmZip(MOUNTAIN_ZIP)
  const entries = outer.getEntries()

  // GeoJSON zip만 필터
  const geojsonEntries = entries.filter(e => e.entryName.endsWith('_geojson.zip'))
  console.log(`[T2] GeoJSON zip 수: ${geojsonEntries.length}`)

  const samples: TrailRecord[] = []
  const sampledMountains = new Set<string>()
  const diffCounts: Record<string, number> = {}

  for (const ge of geojsonEntries) {
    if (samples.length >= SAMPLE_TARGET) break

    const gjBuf = outer.readFile(ge)
    if (!gjBuf) continue

    const gjInner = new AdmZip(gjBuf)
    for (const inner of gjInner.getEntries()) {
      // SPOT 제외, 메인 PMNTN 파일만 (JSON)
      const name = inner.entryName
      if (name.includes('SPOT') || !name.endsWith('.json')) continue

      const content = gjInner.readFile(inner)
      if (!content) continue

      try {
        const trails = readGeoJsonTrails(content)
        for (const t of trails) {
          samples.push(t)
          if (t.MNTN_NM) sampledMountains.add(t.MNTN_NM)
          const diff = t.PMNTN_DFFL.trim()
          if (diff) diffCounts[diff] = (diffCounts[diff] || 0) + 1
          if (samples.length >= SAMPLE_TARGET) break
        }
      } catch {
        // skip malformed JSON
      }
    }
  }

  const total = samples.length
  console.log(`[T2] 샘플링 완료: ${total}건 (목표: ${SAMPLE_TARGET})`)

  const diffFill = samples.filter(r => isPresent(r.PMNTN_DFFL)).length / total
  const distFill = samples.filter(r => isPresent(r.PMNTN_LT)).length / total
  const upFill   = samples.filter(r => isPresent(r.PMNTN_UPPL)).length / total
  const downFill = samples.filter(r => isPresent(r.PMNTN_GODN)).length / total
  const anyTime  = samples.filter(r => r.PMNTN_UPPL > 0 || r.PMNTN_GODN > 0).length / total

  const minFill = Math.min(diffFill, distFill, anyTime)
  const kill = minFill < KILL_THRESHOLD
  const killReason = kill
    ? `3필드 채움률 최소값 ${(minFill * 100).toFixed(1)}% < 기준 60%`
    : undefined

  const result: FillRateResult = {
    total_sampled: total,
    difficulty_fill:    diffFill,
    distance_fill:      distFill,
    uphill_time_fill:   upFill,
    downhill_time_fill: downFill,
    any_time_fill:      anyTime,
    kill,
    kill_reason:        killReason,
    difficulty_values:  diffCounts,
    sample_mountains:   [...sampledMountains].slice(0, 20),
  }

  // 콘솔 출력
  console.log(`\n── 채움률 ──`)
  console.log(`  난이도   (PMNTN_DFFL): ${(diffFill * 100).toFixed(1)}%`)
  console.log(`  거리     (PMNTN_LT):   ${(distFill * 100).toFixed(1)}%`)
  console.log(`  소요시간 (상행+하행):  ${(anyTime  * 100).toFixed(1)}%`)
  console.log(`\n난이도 분포: ${JSON.stringify(diffCounts)}`)
  console.log(`\n── 판정 ──`)
  console.log(kill ? `  ❌ KILL: ${killReason}` : `  ✅ OK — 채움률 기준 통과`)

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 't2-fill-rate.json'),
    JSON.stringify(result, null, 2), 'utf-8'
  )

  return result
}

main().then(r => {
  process.exit(r.kill ? 1 : 0)
}).catch(e => {
  console.error('[T2] 오류:', e)
  process.exit(2)
})
