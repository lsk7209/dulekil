import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export const metadata: Metadata = {
  title: '사이트 소개',
  description: '둘레길 — 한국 100대 명산 완등 챌린지를 위한 코스·둘레길 정보 사이트 소개',
}

export default function AboutPage() {
  return (
    <div id="top">
      <SiteHeader />
      <main className="wrap wrap--narrow" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <div className="eyebrow" style={{ marginBottom: 12 }}>소개</div>
        <h1 className="h1" style={{ marginBottom: 24 }}>둘레길 소개</h1>

        <div className="body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <p>
            <b>둘레길</b>은 한국 산림청이 선정한 100대 명산 완등 챌린지에 도전하는 등산객을 위한 정보 사이트입니다.
            "집에서 다음에 어느 산을 갈지 계획하는 단계"를 돕습니다.
          </p>
          <p>
            코스 난이도·거리·소요시간·들머리 대중교통 정보를 한 곳에서 비교하고,
            가입 없이 완등 기록을 브라우저에 저장할 수 있습니다.
          </p>
          <p>
            모든 코스 정보는 공공데이터(data.go.kr, 산림청, 한국관광공사)를 가공해 제공합니다.
            일부 설명은 AI가 보조 작성한 데이터 가공물입니다.
          </p>

          <div className="safety" style={{ marginTop: 8 }}>
            <div>
              <h4>데이터 출처</h4>
              <p>전국등산로표준데이터 (data.go.kr ID: 15029184, 공공누리 제1유형) · 한국관광공사 두루누비 · 산림청 명산등산로</p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
