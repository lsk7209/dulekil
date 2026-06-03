/**
 * T4 — 100대 명산 매핑률
 * 산림청 공식 100대 명산 목록 ↔ 전국등산로표준데이터 산명 매핑률 측정
 * 킬 기준: 매핑률 < 70%
 */

import AdmZip from 'adm-zip'
import fs from 'fs'
import path from 'path'

const ROOT = path.resolve(__dirname, '../..')
const MOUNTAIN_ZIP = path.join(ROOT, 'docs', 'mountain.zip')
const OUTPUT_DIR = path.join(ROOT, 'scripts', 'phase05')

const KILL_THRESHOLD = 0.70

// 산림청 공식 100대 명산 목록 (2002년 선정)
export const TOP_100_MOUNTAINS: string[] = [
  '가리산', '가야산', '가지산', '감악산', '강천산',
  '계룡산', '계방산', '공작산', '관악산', '광덕산',
  '구병산', '금수산', '금오산', '금정산', '기백산',
  '남덕유산', '남산', '내연산', '내장산', '대둔산',
  '대야산', '덕숭산', '덕유산', '도락산', '도봉산',
  '두륜산', '두타산', '마니산', '마이산', '명성산',
  '명지산', '모악산', '무등산', '무학산', '민주지산',
  '방태산', '백덕산', '백운산', '변산', '북한산',
  '불암산', '비슬산', '사량도지리산', '소백산', '속리산',
  '수락산', '신불산', '연화산', '오대산', '오봉산',
  '용문산', '용화산', '운달산', '운문산', '월악산',
  '월출산', '유명산', '응봉산', '장안산', '재약산',
  '적상산', '주왕산', '주흘산', '지리산', '천관산',
  '천마산', '천성산', '천왕산', '청량산', '청화산',
  '축령산', '치악산', '칠갑산', '태백산', '팔공산',
  '팔봉산', '학가산', '한라산', '함백산', '향로봉',
  '화악산', '화왕산', '황매산', '황석산', '황악산',
  '황장산', '회문산', '강화 마니산', '경주 남산', '광양 백운산',
  '포천 백운산', '울진 응봉산', '고흥 팔영산', '완주 운장산', '상주 갑장산',
  '홍성 오서산', '장성 축령산', '합천 황매산', '경남 지리산', '제주 한라산',
]

// 정규화: 괄호·공백·지역명 제거 후 비교
function normalize(name: string): string {
  return name
    .replace(/\s+/g, '')
    .replace(/[()（）]/g, '')
    .replace(/^(서울|경기|강원|충북|충남|전북|전남|경북|경남|제주)\s*/g, '')
    .trim()
}

export interface MappingResult {
  total_in_data: number
  top100_matched: string[]
  top100_unmatched: string[]
  mapping_rate: number
  kill: boolean
  kill_reason?: string
}

async function main(): Promise<MappingResult> {
  console.log('[T4] 100대 명산 매핑률 분석...')

  const outer = new AdmZip(MOUNTAIN_ZIP)
  const entries = outer.getEntries()
  const geojsonEntries = entries.filter(e => e.entryName.endsWith('_geojson.zip'))

  // 데이터에서 산명 수집 (중복 제거)
  const dataMountainNames = new Set<string>()
  let processed = 0

  for (const ge of geojsonEntries) {
    const gjBuf = outer.readFile(ge)
    if (!gjBuf) continue
    const gjInner = new AdmZip(gjBuf)

    for (const inner of gjInner.getEntries()) {
      if (inner.entryName.includes('SPOT') || !inner.entryName.endsWith('.json')) continue
      const content = gjInner.readFile(inner)
      if (!content) continue
      try {
        const json = JSON.parse(content.toString('utf-8'))
        for (const f of (json.features || [])) {
          const nm = f?.attributes?.MNTN_NM
          if (nm && typeof nm === 'string' && nm.trim()) {
            dataMountainNames.add(nm.trim())
          }
        }
      } catch { /* skip */ }
    }

    processed++
    if (processed % 100 === 0) {
      process.stdout.write(`\r[T4] 처리 중: ${processed}/${geojsonEntries.length} (발견된 산: ${dataMountainNames.size})`)
    }
  }

  console.log(`\n[T4] 데이터 내 고유 산 수: ${dataMountainNames.size}`)
  console.log(`[T4] 샘플 산명: ${[...dataMountainNames].slice(0, 10).join(', ')}`)

  // 매핑 수행
  const normDataNames = [...dataMountainNames].map(n => normalize(n))
  const matched: string[] = []
  const unmatched: string[] = []

  for (const top100 of TOP_100_MOUNTAINS) {
    const normTop = normalize(top100)
    const found = normDataNames.some(n => n.includes(normTop) || normTop.includes(n))
    if (found) matched.push(top100)
    else unmatched.push(top100)
  }

  const rate = matched.length / TOP_100_MOUNTAINS.length
  const kill = rate < KILL_THRESHOLD

  const result: MappingResult = {
    total_in_data: dataMountainNames.size,
    top100_matched: matched,
    top100_unmatched: unmatched,
    mapping_rate: rate,
    kill,
    kill_reason: kill ? `매핑률 ${(rate * 100).toFixed(1)}% < 기준 70%` : undefined,
  }

  console.log(`\n── 매핑 결과 ──`)
  console.log(`  매칭됨:     ${matched.length} / ${TOP_100_MOUNTAINS.length}`)
  console.log(`  매핑률:     ${(rate * 100).toFixed(1)}%`)
  if (unmatched.length > 0) {
    console.log(`  미매칭 산:  ${unmatched.join(', ')}`)
  }
  console.log(kill ? `  ❌ KILL: ${result.kill_reason}` : `  ✅ OK — 매핑률 기준 통과`)

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 't4-mapping.json'),
    JSON.stringify(result, null, 2), 'utf-8'
  )

  return result
}

main().then(r => {
  process.exit(r.kill ? 1 : 0)
}).catch(e => {
  console.error('[T4] 오류:', e)
  process.exit(2)
})
