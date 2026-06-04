/**
 * Gemini 없이 DB 데이터로 100대 명산 description 채우기
 * 지역·고도·코스 수·난이도·거리 조합으로 고유 문장 생성
 */
import { db, schema } from './db-client'
import { config } from 'dotenv'
import { eq, isNull, or } from 'drizzle-orm'

config({ path: '.env.local' })

const REGION_CHAR: Record<string, string> = {
  '강원': '웅장한 백두대간 줄기',
  '경기': '수도권 접근성이 좋은',
  '서울': '도심 속 자연을 품은',
  '충북': '내륙 깊숙이 자리한',
  '충남': '서해 조망이 일품인',
  '경북': '낙동강 상류를 굽어보는',
  '경남': '남해 조망을 품은',
  '전북': '호남 정기가 모인',
  '전남': '다도해를 조망하는',
  '부산': '도시와 바다가 어우러진',
  '대구': '분지 지형 속',
  '울산': '동해안을 바라보는',
  '인천': '서해를 품은',
  '제주': '화산섬의 독특한 지형을 가진',
  '광주': '호남 평야를 내려다보는',
}

function regionChar(region: string | null): string {
  if (!region) return '수려한 자연경관을 가진'
  for (const [key, val] of Object.entries(REGION_CHAR)) {
    if (region.includes(key)) return val
  }
  return '뛰어난 경관을 자랑하는'
}

function diffLabel(diff: string | null): string {
  if (diff === '하') return '완만한 경사로 초보자도 오르기 좋으며'
  if (diff === '상') return '가파른 구간이 많아 체력 안배가 필요하며'
  return '적당한 난이도로 일반 등산객에게 적합하며'
}

function buildDescription(
  name: string,
  region: string | null,
  elev: number | null,
  courseCount: number,
  minDist: number | null,
  maxDist: number | null,
  mainDiff: string | null,
): string {
  const char   = regionChar(region)
  const elevStr = elev ? `해발 ${elev.toLocaleString()}m` : '높은 고도'
  const diff   = diffLabel(mainDiff)

  let courseDesc = ''
  if (courseCount > 0 && minDist !== null) {
    const distRange = maxDist && maxDist !== minDist
      ? `${minDist.toFixed(1)}~${maxDist.toFixed(1)}km`
      : `${minDist.toFixed(1)}km`
    courseDesc = ` 총 ${courseCount}개의 등산로가 정비돼 있으며 코스 거리는 ${distRange}입니다.`
  } else if (courseCount > 0) {
    courseDesc = ` 총 ${courseCount}개의 등산로가 있습니다.`
  }

  return `${name}은 ${char} ${elevStr}의 명산으로, 산림청이 선정한 한국 100대 명산 중 하나입니다. ${diff}사계절 내내 등산객이 즐겨 찾는 곳입니다.${courseDesc} 출발 전 날씨와 등산로 통제 여부를 반드시 확인하세요.`
}

async function main() {
  console.log('[fill-descriptions] 빈 description 채우기 시작...')

  const targets = await db.query.mountains.findMany({
    where: (t, { and, eq, or, isNull }) => and(
      eq(t.is_top100, true),
      or(isNull(t.description), eq(t.description, '')),
    ),
  })

  console.log(`대상: ${targets.length}개 산`)
  if (targets.length === 0) {
    console.log('모두 채워져 있음 — 종료')
    process.exit(0)
  }

  let filled = 0
  for (const m of targets) {
    const courses = await db.select({
      distance: schema.courses.distance,
      diff_norm: schema.courses.diff_norm,
    })
      .from(schema.courses)
      .where(eq(schema.courses.mountain_id, m.id))

    const dists = courses.map(c => c.distance).filter((d): d is number => d !== null && d > 0)
    const minDist = dists.length > 0 ? Math.min(...dists) : null
    const maxDist = dists.length > 0 ? Math.max(...dists) : null

    const diffCounts: Record<string, number> = {}
    for (const c of courses) {
      const d = c.diff_norm ?? '중'
      diffCounts[d] = (diffCounts[d] ?? 0) + 1
    }
    const mainDiff = Object.entries(diffCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null

    const desc = buildDescription(
      m.name, m.region, m.elev,
      courses.length, minDist, maxDist, mainDiff,
    )

    await db.update(schema.mountains)
      .set({ description: desc, updated_at: new Date() })
      .where(eq(schema.mountains.id, m.id))

    console.log(`  ✓ ${m.name} (${m.region} / ${m.elev}m / 코스${courses.length}개)`)
    filled++
  }

  console.log(`\n✅ ${filled}개 산 description 완료`)
  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
