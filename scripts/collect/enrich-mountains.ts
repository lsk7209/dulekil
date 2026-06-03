/**
 * P3 — Gemini로 100대 명산 산 소개 보강
 * mountains + courses DB 데이터 기반 → description 생성 + pages 레지스트리 등록
 * 실행 전 GEMINI_API_KEY 환경변수 필요
 */
import { db, schema } from './db-client'
import { generate } from '../../lib/gemini'
import { buildPrompt } from '../../lib/personas'
import { runQualityGate } from '../../lib/quality-gate'
import { eq, isNull } from 'drizzle-orm'

const PERSONAS: Array<'traveler' | 'hiker'> = ['hiker', 'traveler']
const LIMIT = 20  // 1회 실행 최대 처리 수 (일일 Gemini 쿼터 고려)

function toSlug(name: string): string {
  return encodeURIComponent(name.replace(/\s+/g, ''))
}

async function main() {
  const key = process.env.GEMINI_API_KEY
  if (!key) {
    console.error('❌ GEMINI_API_KEY 없음 — .env.local에 추가 후 실행')
    process.exit(1)
  }

  console.log('[enrich-mountains] Gemini 보강 시작...')

  // 아직 description 없는 100대 명산 대상
  const mountains = await db.query.mountains.findMany({
    where: (t, { eq, and, isNull }) => and(eq(t.is_top100, true), isNull(t.description)),
    limit: LIMIT,
  })

  console.log(`대상: ${mountains.length}개 산`)
  let enriched = 0

  for (const m of mountains) {
    // 해당 산의 코스 조회
    const courses = await db.query.courses.findMany({
      where: (t, { eq }) => eq(t.mountain_id, m.id),
      columns: { name: true, distance: true, duration_up: true, diff_norm: true, transit: true },
      limit: 5,
    })

    const persona = PERSONAS[enriched % 2]
    const ctx = {
      mountain: { name: m.name, region: m.region ?? '', elev: m.elev ?? undefined },
      courses: courses.map(c => ({
        name: c.name ?? '',
        distance: c.distance,
        duration_up: c.duration_up,
        diff_norm: c.diff_norm,
        transit: c.transit,
      })),
    }

    try {
      const description = await generate(buildPrompt(persona, ctx), { temperature: 0.75 })

      // 품질 게이트 간이 체크 (full gate는 페이지 생성 단계에서)
      if (description.trim().length < 150) {
        console.log(`  ⚠️  ${m.name} 설명 너무 짧음 (${description.length}자) — 스킵`)
        continue
      }

      // description 저장
      await db.update(schema.mountains)
        .set({ description: description.trim() })
        .where(eq(schema.mountains.id, m.id))

      // pages 레지스트리 등록
      const slug = `mountains/${toSlug(m.name)}`
      await db.insert(schema.pages).values({
        entity_type: 'mountain',
        entity_id:   m.id,
        slug,
        title:       `${m.name} 등산 코스`,
        status:      'enriched',
        quality_score: 60,  // 품질게이트 전 기본값
        gate_passed: false,
        persona,
        index_flag: m.is_top100 ?? false,
        active_sections: JSON.stringify(['교통', '계절']),
        unique_points:   JSON.stringify([
          `해발 ${m.elev ?? '?'}m`,
          `코스 수 ${courses.length}개`,
          m.region ?? '',
        ].filter(Boolean)),
      }).onConflictDoNothing()

      enriched++
      console.log(`  ✓ ${m.name} (${persona}, ${description.length}자)`)
    } catch (e) {
      console.error(`  ✗ ${m.name}: ${e}`)
    }

    // Gemini 레이트 가드 — 모듈 내부에서 처리하지만 추가 여유
    await new Promise(r => setTimeout(r, 500))
  }

  console.log(`\n✅ ${enriched}/${mountains.length}개 보강 완료`)
  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
