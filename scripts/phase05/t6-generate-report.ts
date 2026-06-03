/**
 * T6 — 종합 리포트 생성
 * T1~T5 결과를 읽어 phase05-report.md 생성 + GO/NO-GO 판정
 */

import fs from 'fs'
import path from 'path'
import type { FillRateResult } from './t2-fill-rate'
import type { MappingResult } from './t4-mapping'
import type { LicenseResult } from './t5-license'

const DIR = path.resolve(__dirname)

function readJson<T>(file: string): T | null {
  const p = path.join(DIR, file)
  if (!fs.existsSync(p)) return null
  return JSON.parse(fs.readFileSync(p, 'utf-8')) as T
}

function pct(n: number): string {
  return `${(n * 100).toFixed(1)}%`
}

function badge(ok: boolean): string {
  return ok ? '✅ 통과' : '❌ KILL'
}

async function main() {
  console.log('[T6] 리포트 생성...')

  const fieldMap = readJson<Record<string, unknown>>('FIELD_MAP.json')
  const fill = readJson<FillRateResult>('t2-fill-rate.json')
  const mapping = readJson<MappingResult>('t4-mapping.json')
  const license = readJson<LicenseResult>('t5-license.json')

  // KILL 판정 종합
  const kills: string[] = []
  if (fill?.kill)    kills.push(`채움률 KILL: ${fill.kill_reason}`)
  if (mapping?.kill) kills.push(`매핑률 KILL: ${mapping.kill_reason}`)
  if (license?.kill) kills.push(`라이선스 KILL: ${license.kill_reason}`)

  const go = kills.length === 0

  // 마크다운 리포트 생성
  const now = new Date().toISOString().slice(0, 10)
  const md = `# Phase 0.5 검증 리포트

> 생성일: ${now}
> **최종 판정: ${go ? '✅ GO — 본개발 진행 가능' : '❌ NO-GO — 아래 항목 해결 필요'}**

---

## 데이터 소스

| 소스 | ID | 형식 |
|------|----|------|
| 전국등산로표준데이터 (data.go.kr) | 15029184 | GeoJSON + Shapefile + GPX |
| 공간정보 오픈플랫폼 API (vworld) | LT_L_FRSTCLIMB | REST API |

---

## T1 — 필드맵

**로컬 GeoJSON 필드** (PMNTN 메인):

| 필드명 | 설명 | 샘플값 |
|--------|------|--------|
| MNTN_NM | 산 이름 | 북악산 |
| PMNTN_NM | 등산로 이름 | 부암동구간 |
| PMNTN_DFFL | 난이도 | 쉬움 |
| PMNTN_LT | 구간거리(km) | 0.01 |
| PMNTN_UPPL | 상행 소요시간(분) | 1 |
| PMNTN_GODN | 하행 소요시간(분) | 0 |
| PMNTN_MTRQ | 노면 재질 | 마사토 |
| PMNTN_RISK | 위험 구간 | 암반 오를때 주의 |
| MNTN_CODE | 행정코드 | 111100101 |
| DATA_STDR_ | 데이터 기준일 | 2016-12-31 |

**vworld API 필드** (LT_L_FRSTCLIMB):

| 필드명 | 설명 |
|--------|------|
| mntn_nm | 산명칭 |
| cat_nam | 난이도 (상/중/하) |
| sec_len | 구간거리(m) |
| up_min | 상행속도(분) |
| down_min | 하행속도(분) |
| ag_geom | 좌표(WGS84 LineString) |

> 구조: 외피 zip → [산코드].zip → PMNTN\_[산명]\_[코드].json (GeoJSON)
> 총 ${fieldMap?.stats ? (fieldMap.stats as Record<string, number>).base_zips : 'N/A'}개 지역코드, ${fieldMap?.stats ? (fieldMap.stats as Record<string, number>).gpx_zips : 'N/A'}개 GPX 파일

---

## T2 — 결측률 분석 ${fill ? badge(!fill.kill) : '⚠️ 미실행'}

${fill ? `
| 필드 | 채움률 | 판정 |
|------|--------|------|
| 난이도 (PMNTN_DFFL) | ${pct(fill.difficulty_fill)} | ${fill.difficulty_fill >= 0.6 ? '✅' : '❌'} |
| 거리 (PMNTN_LT) | ${pct(fill.distance_fill)} | ${fill.distance_fill >= 0.6 ? '✅' : '❌'} |
| 소요시간 (상행+하행) | ${pct(fill.any_time_fill)} | ${fill.any_time_fill >= 0.6 ? '✅' : '❌'} |

**샘플 수**: ${fill.total_sampled}건

**난이도 분포**:
${Object.entries(fill.difficulty_values).map(([k, v]) => `- ${k}: ${v}건`).join('\n')}

**샘플 산명**: ${fill.sample_mountains.join(', ')}
` : '> T2 결과 없음 — t2-fill-rate.ts 미실행'}

---

## T3 — 두루누비 GPX

> ⚠️ 미검증 — 두루누비 데이터 미보유.
> GPX 데이터는 mountain.zip 내 각 코드별 _gpx.zip에 포함되어 있어 대체 가능.
> mountain.zip GPX 파일 수: ${fieldMap?.stats ? (fieldMap.stats as Record<string, number>).gpx_zips : 'N/A'}개

---

## T4 — 100대 명산 매핑률 ${mapping ? badge(!mapping.kill) : '⚠️ 미실행'}

${mapping ? `
| 항목 | 값 |
|------|----|
| 매핑률 | ${pct(mapping.mapping_rate)} (${mapping.top100_matched.length}/100) |
| 데이터 내 고유 산 수 | ${mapping.total_in_data} |
| 미매칭 산 | ${mapping.top100_unmatched.join(', ') || '없음'} |
` : '> T4 결과 없음 — t4-mapping.ts 미실행'}

---

## T5 — 라이선스 ${license ? badge(!license.kill) : '⚠️ 미실행'}

${license ? license.sources.map(s => `
### ${s.name}
- 라이선스: **${s.license_type}**
- 상업적 이용: ${s.commercial_ok ? '✅ 가능' : '⚠️ 조건부'}
- DB 저장: ${s.storage_ok ? '✅ 가능' : '⚠️ 현재 불가'}
- 비고: ${s.notes}
${s.action_required ? `- **필요 조치**: ${s.action_required}` : ''}
`).join('\n') : '> T5 결과 없음'}

**권장 1차 소스**: ${license?.recommended_primary || 'data.go.kr mountain.zip'}

---

## KILL 기준 체크

| 항목 | 기준 | 결과 |
|------|------|------|
| 핵심 3필드 채움률 | ≥ 60% | ${fill ? (fill.kill ? `❌ FAIL (${pct(Math.min(fill.difficulty_fill, fill.distance_fill, fill.any_time_fill))})` : `✅ ${pct(Math.min(fill.difficulty_fill, fill.distance_fill, fill.any_time_fill))}`) : '⚠️ 미실행'} |
| 100대명산 매핑률 | ≥ 70% | ${mapping ? (mapping.kill ? `❌ FAIL (${pct(mapping.mapping_rate)})` : `✅ ${pct(mapping.mapping_rate)}`) : '⚠️ 미실행'} |
| 라이선스 | 재배포 가능 | ${license ? (license.kill ? '❌ KILL' : '✅ OK (data.go.kr 공공누리1)') : '⚠️ 미실행'} |

---

## 최종 판정

${go
  ? `## ✅ GO

본개발(P1~P6)을 진행할 수 있습니다.

**진행 조건**:
1. 1차 소스: data.go.kr mountain.zip (공공누리 제1유형) — DB 저장·상업이용 OK
2. vworld API: 운영키 발급 + 상업적 이용 허락 신청 후 추가 활용 가능
3. 모든 페이지에 출처 표기: "출처: data.go.kr, 산림청 (공공누리 제1유형)"
4. P1 인프라 세팅 시작`
  : `## ❌ NO-GO

해결이 필요한 항목:
${kills.map(k => `- ${k}`).join('\n')}

위 항목 해결 후 재검증 필요.`}
`

  const reportPath = path.join(DIR, 'phase05-report.md')
  fs.writeFileSync(reportPath, md, 'utf-8')
  console.log(`\n✅ 리포트 저장: ${reportPath}`)
  console.log(`\n최종 판정: ${go ? '✅ GO' : `❌ NO-GO\n${kills.join('\n')}` }`)

  return go
}

main().then(go => {
  process.exit(go ? 0 : 1)
}).catch(e => {
  console.error('[T6] 오류:', e)
  process.exit(2)
})
