/**
 * T5 — 라이선스 확인
 *
 * 두 데이터 소스의 라이선스 차이를 명확히 정리한다.
 *
 * ① mountain.zip (data.go.kr 전국등산로표준데이터, ID: 15029184)
 *    → 공공누리 제1유형: 출처표시 조건하에 상업적 이용·변경·배포 자유
 *    → DB 저장·가공·재배포 가능  → OK
 *
 * ② 공간정보 오픈플랫폼 vworld API (api.vworld.kr)
 *    → 약관 제10조 7항: 상업적 이용 시 별도 허락 필요 (운영키 필요)
 *    → 약관 제12조 4항: 사전 승낙 없이 데이터 무단 저장 금지
 *    → 개발키만 있는 현재: 상업적 배포 불가 / DB 저장 불가
 *    → 운영키 발급 신청 후 상업적 이용 허락받으면 OK
 *
 * 결론: mountain.zip 데이터를 1차 소스로 사용. vworld API는 실시간 조회(저장 없이)
 *       또는 운영키 + 상업적 이용 허락 취득 후 적재 가능.
 */

import fs from 'fs'
import path from 'path'

const OUTPUT_DIR = path.resolve(__dirname)

export interface LicenseResult {
  sources: {
    name: string
    id: string
    license_type: string
    commercial_ok: boolean
    storage_ok: boolean
    notes: string
    action_required?: string
  }[]
  recommended_primary: string
  kill: boolean
  kill_reason?: string
}

async function main(): Promise<LicenseResult> {
  console.log('[T5] 라이선스 분석...')

  const result: LicenseResult = {
    sources: [
      {
        name: '전국등산로표준데이터 (data.go.kr)',
        id: '15029184',
        license_type: '공공누리 제1유형 (출처표시)',
        commercial_ok: true,
        storage_ok: true,
        notes: '출처: data.go.kr, 산림청. 상업적 이용·변경·DB 저장 모두 허용. 출처 표기 필수.',
      },
      {
        name: '공간정보 오픈플랫폼 등산로 API (vworld)',
        id: 'LT_L_FRSTCLIMB',
        license_type: '공간정보 오픈플랫폼 이용약관 (별도)',
        commercial_ok: false,
        storage_ok: false,
        notes: '제10조7항: 상업적 이용 시 별도 허락 필요. 제12조4항: 사전 승낙 없이 DB 저장 금지. 현재 개발키만 보유.',
        action_required: '운영키 발급 신청 + 상업적 이용 허락 신청 (vworld 운영기관). 취득 전까지 실시간 조회 전용으로만 사용.',
      },
    ],
    recommended_primary: '전국등산로표준데이터 (data.go.kr, mountain.zip)',
    kill: false,
  }

  for (const s of result.sources) {
    const status = s.commercial_ok && s.storage_ok ? '✅ OK' : '⚠️  조건부'
    console.log(`\n[${s.name}]`)
    console.log(`  라이선스: ${s.license_type}`)
    console.log(`  상업적 이용: ${s.commercial_ok ? '가능' : '조건부'}`)
    console.log(`  DB 저장: ${s.storage_ok ? '가능' : '현재 불가'}`)
    console.log(`  판정: ${status}`)
    if (s.action_required) console.log(`  조치 필요: ${s.action_required}`)
  }

  // data.go.kr 데이터가 OK이면 계속 진행 가능
  const primaryOk = result.sources[0].commercial_ok && result.sources[0].storage_ok
  console.log(`\n── 판정 ──`)
  console.log(primaryOk
    ? '  ✅ OK — data.go.kr 데이터로 진행 가능. vworld API는 운영키 취득 후 확장 가능.'
    : '  ❌ KILL — 주 데이터 소스 사용 불가')

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 't5-license.json'),
    JSON.stringify(result, null, 2), 'utf-8'
  )

  return result
}

main().then(r => {
  process.exit(r.kill ? 1 : 0)
}).catch(e => {
  console.error('[T5] 오류:', e)
  process.exit(2)
})
