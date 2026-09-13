import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Icon } from '@/components/icon'

interface GuideContent {
  title: string
  description: string
  sections: { heading: string; body: string }[]
  faq: { q: string; a: string }[]
}

const GUIDES: Record<string, GuideContent> = {
  'beginner-100': {
    title: '초보자를 위한 100대 명산 시작 가이드',
    description: '100대 명산 챌린지를 처음 시작하는 분을 위한 완전 입문서. 산 선택부터 준비, 안전까지.',
    sections: [
      {
        heading: '100대 명산이란?',
        body: '산림청이 2002년 선정한 한국의 대표 명산 100곳입니다. 경관·역사·문화적 가치를 기준으로 선정됐으며, 전국 각 지역에 고르게 분포해 있습니다. 완등에 특별한 자격이나 등록은 필요 없습니다.',
      },
      {
        heading: '어느 산부터 시작할까?',
        body: '처음에는 난이도 \'하\' 또는 \'중\'으로 분류된 산을 선택하세요. 관악산(632m), 청계산(618m), 계룡산(845m) 등 대중교통으로 접근 가능한 수도권·충청 산이 입문에 적합합니다. 고산(1,400m 이상)은 체력이 쌓인 후 도전하세요.',
      },
      {
        heading: '필수 준비물',
        body: '등산화(발목 보호), 배낭(20~30L), 물 1.5L 이상, 간식, 우비, 비상 연락처. 겨울에는 아이젠·장갑·보온 의류를 추가합니다. 등산 스틱은 하산 시 무릎 보호에 효과적입니다.',
      },
      {
        heading: '안전 수칙',
        body: '출발 전 기상청 산악날씨와 산림청·국립공원 통제정보를 확인하세요. 실제 일몰·코스·노면·일행 속도와 탈출로를 반영해 어두워지기 전에 복귀할 보수적인 회항 시점을 정하고, 지인에게 경로와 귀가 확인 시각을 알리세요. 길을 잃었거나 계획 경로가 위험해졌다면 무리하게 진행하거나 임의의 지름길로 내려가지 말고 119 또는 관리기관에 상담하세요.',
      },
    ],
    faq: [
      { q: '100대 명산 완등 인증을 받을 수 있나요?', a: '한국산악회, 블랙야크 등 민간 단체에서 인증 프로그램을 운영합니다. 각 단체 홈페이지를 통해 신청할 수 있습니다.' },
      { q: '초보자도 100대 명산에 오를 수 있나요?', a: '네, 100대 명산 중에는 난이도가 낮고 거리가 짧은 산이 많습니다. 체력에 맞게 선택하면 초보자도 충분히 도전할 수 있습니다.' },
      { q: '100대 명산을 다 오르는 데 얼마나 걸리나요?', a: '개인 페이스에 따라 다르지만, 연간 10~20개씩 오른다면 5~10년 내에 완등이 가능합니다. 매주 1회 꾸준히 산행하는 분들은 3~5년에 완주하기도 합니다.' },
    ],
  },
  'transit-mountains': {
    title: '대중교통으로 가는 명산 — 지하철·버스 들머리 모음',
    description: '차 없이도 오를 수 있는 100대 명산. 역에서 도보 30분 이내 들머리 정보를 정리했습니다.',
    sections: [
      {
        heading: '수도권 대중교통 명산',
        body: '관악산(서울대입구역), 청계산(청계산입구역), 북한산(구파발역), 도봉산(도봉산역), 수락산(당고개역), 불암산(별내역)은 지하철역에서 도보 10~15분 내로 들머리에 닿을 수 있는 대표적인 대중교통 산행지입니다.',
      },
      {
        heading: '지방 대중교통 명산',
        body: '계룡산(대전 시내버스), 금정산(부산 도시철도), 무등산(광주 시내버스), 내장산(정읍역 버스)처럼 지방 광역시에서도 대중교통으로 접근 가능한 명산들이 있습니다.',
      },
      {
        heading: '당일치기 주의사항',
        body: '대중교통 이용 시 막차 시간을 반드시 확인하세요. 특히 지방 노선은 주말 막차가 이른 경우가 있습니다. 하산 후 최소 30분의 여유를 두고 이동 계획을 세우는 것이 좋습니다.',
      },
    ],
    faq: [
      { q: '가장 접근성 좋은 대중교통 명산은?', a: '관악산(2호선 서울대입구역 도보 12분), 청계산(신분당선 청계산입구역 도보 8분)이 가장 접근하기 쉽습니다.' },
      { q: '설악산도 대중교통으로 갈 수 있나요?', a: '속초시외버스터미널에서 설악동행 시내버스를 이용할 수 있습니다. 서울에서 속초까지는 고속버스 약 2시간 30분 소요됩니다.' },
    ],
  },
  'gear-basics': {
    title: '등산 장비 기초 가이드 — 초보자 필수 구비 목록',
    description: '처음 등산을 시작하는 분을 위한 장비 선택 가이드. 등산화·배낭·의류 기준과 예산별 추천.',
    sections: [
      {
        heading: '등산화 — 발목 보호가 최우선',
        body: '등산화는 미드컷(발목 중간 높이) 이상을 권장합니다. 발볼이 넓은 한국인 발형에는 국내 브랜드나 D 폭 이상 제품이 잘 맞습니다. 방수(GTX) 기능은 봄·가을 빗속 산행에서 체감이 크지만, 여름 계곡 산행에는 통기형이 더 쾌적합니다. 예산은 10~15만 원대부터 실용적인 선택지가 있습니다. 매장에서 등산 양말을 신고 직접 착화해 엄지발가락이 앞창에 닿지 않는지 확인하세요.',
      },
      {
        heading: '배낭 — 용량과 허리띠 핏',
        body: '당일 산행은 20~25L, 1박 산행은 35~45L가 기준입니다. 허리띠(힙벨트)가 장착된 제품을 고르세요. 무게 중심이 허리로 내려와 어깨 피로가 크게 줄어듭니다. 레인커버(방수 덮개)가 포함된 제품이나 별도 구비를 권장합니다. 브랜드보다 등판 길이가 본인 허리에 맞는지가 더 중요합니다.',
      },
      {
        heading: '의류 레이어링 — 3층 시스템',
        body: '등산 의류는 베이스(흡습속건 내의) + 미들(보온 fleece) + 아우터(방풍·방수 재킷) 3층 구조가 기본입니다. 면 소재는 땀이 식으면 저체온을 유발하므로 산에서는 피하세요. 최소한 아우터 한 장은 고어텍스 또는 동급 방수투습 소재를 권장합니다. 여름에도 정상부는 기온이 낮으므로 얇은 바람막이는 배낭에 항상 챙기세요.',
      },
      {
        heading: '필수 소품 체크리스트',
        body: '등산 스틱(하산 무릎 보호), 헤드랜턴(배터리 교체형 권장), 구급 키트(반창고·소독제·진통제), 보온병, 비상식(에너지바·초콜릿), 지도 또는 등산 앱. 스마트폰 보조배터리는 장시간 산행에 필수입니다. GPS 수신이 약한 구간에서는 공식 지도 앱(산림청 숲길)이 더 신뢰성 있습니다.',
      },
    ],
    faq: [
      { q: '등산화는 꼭 전문 브랜드여야 하나요?', a: '중요한 것은 브랜드보다 핏과 기능입니다. 미끄럼 방지 밑창(비브람 또는 동급)과 발목 지지 기능이 있다면 10만 원대 제품도 충분히 실용적입니다.' },
      { q: '겨울 산행에는 어떤 장비가 추가되나요?', a: '아이젠(12발 체인 아이젠 권장), 스패츠(방설 덮개), 보온 장갑, 발라클라바(얼굴 보온), 두꺼운 등산 양말이 필요합니다. 영하 10도 이하에서는 일반 등산화 대신 방한 등산화를 고려하세요.' },
      { q: '등산 스틱이 꼭 필요한가요?', a: '필수는 아니지만 하산 시 무릎 하중을 약 25% 줄여줍니다. 100대 명산처럼 하산 거리가 긴 코스에서는 체력 차이가 뚜렷합니다. 카본 소재는 가볍고 알루미늄 소재는 내구성이 좋습니다.' },
    ],
  },
  'seasonal-hiking': {
    title: '계절별 등산 준비 가이드 — 봄·여름·가을·겨울',
    description: '계절마다 달라지는 등산 준비 사항. 봄 진달래부터 겨울 설경까지, 시즌별 핵심 포인트 정리.',
    sections: [
      {
        heading: '봄(3~5월) — 진달래와 철쭉 시즌',
        body: '3월 말~4월 초는 진달래, 5월 중순은 철쭉이 피는 시기입니다. 산불 위험이 가장 높은 시기이기도 합니다. 3~5월 중 입산 통제 구역이 확대되는 경우가 많으니 출발 전 산림청 산불예방 통제정보를 반드시 확인하세요. 날씨 변화가 심해 아침과 오후 기온 차이가 15도 이상 벌어지는 날도 있습니다. 얇은 방풍 재킷을 배낭에 꼭 챙기세요.',
      },
      {
        heading: '여름(6~8월) — 계곡과 새벽 산행',
        body: '폭염이 심한 7~8월에는 새벽 4~5시 출발이 가장 현명합니다. 오전 10시 이후 능선에서는 직사광선을 피하기 어렵습니다. 수분 보충은 매 30분마다, 시간당 500mL 이상을 목표로 합니다. 계곡이 있는 산(내연산, 두타산, 방태산)은 여름 피서지로 최적입니다. 장마철에는 계곡 수위가 빠르게 오르므로 계곡 인접 루트는 기상 확인 후 선택하세요.',
      },
      {
        heading: '가을(9~11월) — 단풍 절정 시즌',
        body: '단풍은 설악산(강원)이 10월 초, 내장산(전북)·두륜산(전남)이 11월 중순에 절정을 맞습니다. 이 시기는 1년 중 등산객이 가장 몰리는 시즌으로, 주요 명산 주차장은 토요일 오전 8시 이전에 가득 찹니다. 대중교통을 이용하거나 평일 산행을 적극 권장합니다. 10월부터 고산은 아침 기온이 0도 이하로 내려갑니다.',
      },
      {
        heading: '겨울(12~2월) — 설경과 아이젠 필수',
        body: '겨울 설경이 아름다운 산은 태백산(천제단), 덕유산(향적봉), 설악산(대청봉)입니다. 12월부터 고산에는 아이젠 착용이 사실상 필수입니다. 일몰이 오후 5시 전후로 빨라지므로 산행 시작 시각을 오전 7시 이전으로 당기는 것이 안전합니다. 바람막이가 없는 능선에서는 체감온도가 실제 기온보다 10~15도 낮습니다.',
      },
    ],
    faq: [
      { q: '등산하기 가장 좋은 계절은?', a: '개인 취향에 따라 다르지만, 기상과 체력 관리 면에서는 9~10월 가을이 가장 쾌적합니다. 기온이 낮고 공기가 맑아 조망이 좋으며 습도도 낮습니다.' },
      { q: '폭염 경보 때도 등산해도 되나요?', a: '가능하면 오전 중 하산을 마치는 일정으로 조정하세요. 오전 6시 이전 출발, 오전 11시 이전 하산 완료를 목표로 합니다. 물 2L 이상 휴대, 소금(전해질) 보충도 잊지 마세요.' },
      { q: '겨울 산행 초보자에게 추천하는 산은?', a: '강원도 태백산(1,567m)은 완만한 경사와 잘 정비된 탐방로로 겨울 입문에 적합합니다. 설원 경관이 좋고 관리 인력도 충분합니다.' },
    ],
  },
  'safety-checklist': {
    title: '산행 안전 체크리스트 — 출발 전 10분 점검',
    description: '등산 사고의 대부분은 출발 전 확인으로 예방할 수 있습니다. 기상·장비·통제 정보 점검 순서.',
    sections: [
      {
        heading: '기상·통제 정보 확인 (출발 3일 전)',
        body: '기상청 예보와 산을 관리하는 기관의 통제 공지를 함께 확인하세요. 바람·강수·기온과 현장 통제는 산과 시각에 따라 달라지므로 이 페이지의 고정 수치로 출발 가능 여부를 판단하지 않습니다. 국립공원 탐방예약제 대상 구간은 국립공원공단 예약 안내에서 최신 상태를 확인하세요.',
      },
      {
        heading: '장비 점검 (출발 전날)',
        body: '등산화 밑창과 끈, 배낭 버클의 손상 여부를 직접 확인하세요. 헤드랜턴과 보조배터리는 작동 여부와 충전 상태를 점검합니다. 물과 비상식은 날씨·코스·개인 상태를 고려해 준비하고, 질환이나 복용약이 있다면 개인 의료 지침을 우선하세요.',
      },
      {
        heading: '당일 출발 전 10분 체크리스트',
        body: '지인에게 산행 일정(목적지·코스·예상 귀가 시각)을 알려두세요. 관리 기관의 공식 탐방 정보와 오프라인에서도 확인 가능한 지도를 준비하고, 구급품·비상식·헤드랜턴을 점검합니다. 위급한 구조·구급 상황은 119에 신고하고, 출발 전 일몰 시각과 되돌아설 기준을 정하세요.',
      },
      {
        heading: '산행 중 안전 행동 원칙',
        body: '정해진 등산로를 벗어나지 마세요. 지름길처럼 보이는 비공식 샛길은 조난 사고의 주요 원인입니다. 능선 바위 구간에서는 두 손이 항상 확보된 상태(three-point contact)를 유지하세요. 무릎 통증이 오면 하산 속도를 줄이고 스틱을 활용하세요. 통증을 무시하고 강행하면 하산 완료 전에 보행이 불가능해질 수 있습니다.',
      },
    ],
    faq: [
      { q: '119 신고 시 위치를 어떻게 알리나요?', a: '등산로 곳곳에 설치된 위치 표지판(예: 북한산 03-05) 번호를 알려주세요. 스마트폰 GPS 좌표는 산림청 숲길 앱 또는 카카오맵에서 확인할 수 있습니다. 신호가 약할 때는 문자 신고(119)도 가능합니다.' },
      { q: '혼자 산행해도 안전한가요?', a: '혼자 산행은 사고 때 도움을 받기 어려울 수 있습니다. 지인에게 코스와 귀가 예정 시각을 알리고, 통신 가능 구간과 중간 반환 지점을 확인하세요. 경험·건강 상태·기상에 불확실성이 있으면 동행하거나 계획을 줄이세요.' },
      { q: '비 오는 날 등산은 얼마나 위험한가요?', a: '강수량 한 수치만으로 산행 가능 여부를 단정할 수 없습니다. 기상특보와 관리 기관의 통제 공지를 확인하고, 계곡·낙석·미끄럼 위험이 있거나 현장 상태를 판단하기 어렵다면 산행을 미루세요.' },
    ],
  },
  'one-day-plan': {
    title: '당일치기 산행 계획법 — 코스 선택부터 귀가까지',
    description: '당일 산행을 성공시키는 계획 수립 방법. 거리·고도·교통·식사 계획을 한 번에 잡는 법.',
    sections: [
      {
        heading: '본인 체력 기준 코스 길이 설정',
        body: '초보 여부를 거리나 고도차 한 수치로 판정하지 마세요. 관리 기관이 안내한 코스의 거리·고도차·예상 시간·난이도와 본인의 최근 활동량, 건강 상태, 동행 여부를 함께 비교해야 합니다. 예상 시간에는 휴식·식사·길 찾기와 현장 지연을 고려한 여유를 두고, 출발 전에 중간 반환 지점과 최종 반환 시각을 정하세요. 하산도 노면과 피로도에 따라 오래 걸릴 수 있으므로 별도 시간을 확보하세요.',
      },
      {
        heading: '교통 및 출발 시각 역산',
        body: '기상청의 당일 일몰 시각과 관리 기관의 입산·하산 통제 시간을 먼저 확인한 뒤, 공식 코스 예상 시간과 충분한 비상 여유를 역산해 출발 시각을 정하세요. 대중교통은 운행기관의 최신 시간표에서 막차와 대체편을 확인하고, 주차장 운영 시간과 혼잡 안내도 해당 관리 기관 공지를 기준으로 확인하세요. 정해 둔 반환 시각이 되면 정상 도달 여부와 관계없이 하산하는 계획이 필요합니다.',
      },
      {
        heading: '식사·수분 계획',
        body: '매점이나 식당 운영을 전제로 계획하지 말고 필요한 식사와 비상식은 직접 준비하세요. 필요한 수분량은 기온·습도·노출 시간·운동 강도·개인 건강 상태에 따라 달라 한 가지 시간당 수치로 정할 수 없습니다. 관리 기관의 준비 안내와 개인 의료 지침을 확인하고, 구간 중 보충 가능 여부와 비상 상황을 고려해 준비하세요.',
      },
    ],
    faq: [
      { q: '당일치기로 설악산 대청봉을 오를 수 있나요?', a: '가능 여부를 이 페이지의 고정 시간이나 체력 등급으로 판단할 수 없습니다. 산행일의 국립공원공단 탐방로 통제·코스 안내와 기상특보를 확인하고, 본인의 최근 산행 경험과 건강 상태, 일몰·교통 계획을 함께 검토하세요. 하나라도 불확실하면 더 짧은 계획을 선택하거나 산행을 미루세요.' },
      { q: '산행 중 계획을 변경해도 되나요?', a: '체력이나 기상이 예상과 다를 때는 과감하게 코스를 단축하는 것이 안전합니다. 무리하게 계획을 고집하는 것이 산악사고의 주요 원인 중 하나입니다.' },
      { q: '산 아래 식당은 산행 후 이용할 수 있나요?', a: '대부분의 주요 명산 주변에는 식당가가 있습니다. 단, 인기 산의 경우 오후 2~4시에 대기가 길 수 있으므로 이른 하산을 권장합니다.' },
    ],
  },
}

export function generateStaticParams() {
  return Object.keys(GUIDES).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const guide = GUIDES[params.slug]
  if (!guide) return {}
  const ogUrl = `/og?title=${encodeURIComponent(guide.title)}&type=blog&sub=등산 가이드`
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `https://dullegilgogo.kr/guide/${params.slug}` },
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: 'article',
      url: `https://dullegilgogo.kr/guide/${params.slug}`,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: guide.title }],
    },
    twitter: { card: 'summary_large_image', images: [ogUrl] },
  }
}

export default function GuidePage({ params }: { params: { slug: string } }) {
  const guide = GUIDES[params.slug]
  if (!guide) notFound()

  const guideUrl = `https://dullegilgogo.kr/guide/${params.slug}`
  const howToEligible = ['one-day-plan', 'safety-checklist'].includes(params.slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: guide.title,
        description: guide.description,
        author: { '@type': 'Organization', name: '둘레길고고', url: 'https://dullegilgogo.kr' },
        publisher: { '@type': 'Organization', name: '둘레길고고', url: 'https://dullegilgogo.kr' },
        image: `https://dullegilgogo.kr/og?title=${encodeURIComponent(guide.title)}&type=blog&sub=등산 가이드`,
        mainEntityOfPage: { '@type': 'WebPage', '@id': guideUrl },
      },
      {
        '@type': 'FAQPage',
        mainEntity: guide.faq.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
      ...(howToEligible ? [{
        '@type': 'HowTo',
        name: guide.title,
        description: guide.description,
        image: `https://dullegilgogo.kr/og?title=${encodeURIComponent(guide.title)}&type=blog&sub=등산 가이드`,
        step: guide.sections.map((s, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: s.heading,
          text: s.body,
        })),
      }] : []),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: '홈', item: 'https://dullegilgogo.kr' },
          { '@type': 'ListItem', position: 2, name: '가이드', item: 'https://dullegilgogo.kr/guide' },
          { '@type': 'ListItem', position: 3, name: guide.title, item: guideUrl },
        ],
      },
    ],
  }

  return (
    <div id="top">
      <SiteHeader />
      <main id="main-content">
        <section style={{ background: 'var(--bg-warm)', paddingTop: 36, paddingBottom: 32 }}>
          <div className="wrap wrap--narrow">
            <nav style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--ink-faint)', marginBottom: 20 }}>
              <Link href="/" style={{ color: 'var(--ink-faint)', textDecoration: 'none' }}>홈</Link>
              <Icon name="chevron" size={13} />
              <Link href="/guide" style={{ color: 'var(--ink-faint)', textDecoration: 'none' }}>가이드</Link>
            </nav>
            <div className="eyebrow" style={{ marginBottom: 12 }}>가이드</div>
            <h1 className="h1" style={{ marginBottom: 16 }}>{guide.title}</h1>
            <p className="lead">{guide.description}</p>
          </div>
        </section>

        <article className="wrap wrap--narrow" style={{ paddingTop: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {guide.sections.map(s => (
              <section key={s.heading}>
                <h2 className="h2" style={{ marginBottom: 12, color: 'var(--forest)' }}>{s.heading}</h2>
                <p className="body">{s.body}</p>
              </section>
            ))}

            <section>
              <h2 className="h2" style={{ marginBottom: 20 }}>자주 묻는 질문</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {guide.faq.map(f => (
                  <div key={f.q} style={{ borderBottom: '1px solid var(--line-soft)', paddingBottom: 16 }}>
                    <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 700, color: 'var(--forest)' }}>Q. {f.q}</h3>
                    <p style={{ margin: 0, fontSize: 15, lineHeight: 1.65, color: 'var(--ink-soft)' }}>{f.a}</p>
                  </div>
                ))}
              </div>
            </section>

            <div style={{ padding: '16px 20px', background: 'var(--bg-warm)', borderRadius: 'var(--r)', border: '1px solid var(--line)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--forest)', marginBottom: 10 }}>참고 자료</div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '6px 20px' }}>
                {[
                  { label: '산림청 공식 사이트', url: 'https://www.forest.go.kr' },
                  { label: '국립공원 탐방예약시스템', url: 'https://reservation.knps.or.kr' },
                  { label: '두루누비 (국가 트레일 정보)', url: 'https://www.durunubi.kr' },
                  { label: '기상청 날씨 예보', url: 'https://www.weather.go.kr' },
                ].map(r => (
                  <li key={r.url}>
                    <a href={r.url} target="_blank" rel="noopener noreferrer"
                      style={{ color: 'var(--forest)', fontSize: 13, textDecoration: 'underline', textUnderlineOffset: 3 }}>
                      {r.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="safety">
              <div className="safety__icon"><Icon name="warn" size={21} stroke={2} /></div>
              <div>
                <h4>산행 전 공식 정보를 확인하세요</h4>
                <p>본 가이드의 코스 정보는 공공데이터를 가공한 참고 자료입니다. 실제 산행 전 <a href="https://www.forest.go.kr" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>산림청</a>·<a href="https://www.knps.or.kr" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>국립공원공단</a> 공식 통제정보를 반드시 확인하세요.</p>
              </div>
            </div>
          </div>
        </article>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteFooter />
    </div>
  )
}
