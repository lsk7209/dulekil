import type { HubDataState } from '@/lib/db/queries'

const MESSAGES: Record<Exclude<HubDataState, 'database'>, string> = {
  'database-partial': '산 기본 정보는 확인했지만 등록 구간 정보를 불러오지 못했습니다. 코스가 없는 것으로 해석하지 말고 잠시 후 다시 확인하세요.',
  'static-no-config': '현재 데이터 연결이 구성되지 않아 검토용 기본 산 목록을 표시합니다. 코스 수치와 명산 목록 소속은 원문 출처를 다시 확인하세요.',
  'static-empty': '현재 등록 데이터가 비어 있어 산 목록을 표시하지 않습니다. 데이터 복구 전까지 이를 공식 목록의 부재로 해석하지 마세요.',
  'static-missing-record': '현재 데이터에서 이 산의 검토된 등록 항목을 찾지 못해 기본 참고 정보만 표시합니다. 공식 목록 소속이나 코스 정보로 해석하지 마세요.',
  'static-unavailable': '현재 데이터 연결을 확인할 수 없어 검토용 기본 산 목록을 표시합니다. 잠시 후 다시 확인하고 산행 전 공식 정보를 대조하세요.',
}

export function DataSourceNotice({ state }: { state: HubDataState }) {
  if (state === 'database') return null
  return (
    <aside
      role="status"
      data-data-source-state={state}
      style={{ margin: '16px auto', maxWidth: 1120, padding: '12px 16px', border: '1px solid #d6c9a8', borderRadius: 8, background: '#fffaf0', color: '#5d4b22', fontSize: 14, lineHeight: 1.6 }}
    >
      {MESSAGES[state]}
    </aside>
  )
}
