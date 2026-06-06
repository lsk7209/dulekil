import type { Post } from './posts'

type Topic = {
  cat: Post['cat']
  pal: string
  title: string
  excerpt: string
  main: string
  related: string[]
  angle: string
  reader: string
  points: [string, string, string]
  source: { label: string; url: string }
  links: [string, string]
  cta: string
}

const start = Date.UTC(2026, 7, 24, 21, 0, 0)
const hour = 60 * 60 * 1000

function publishAt(index: number) {
  if (index < 10) {
    return new Date(Date.UTC(2026, 5, 6, index, 0, 0)).toISOString().replace('.000Z', '+00:00')
  }
  return new Date(start + index * 5 * hour).toISOString().replace('.000Z', '+00:00')
}

function dateLabel(index: number) {
  if (index < 10) return '2026.06.06'
  const d = new Date(start + index * 5 * hour + 9 * hour)
  return `${d.getUTCFullYear()}.${String(d.getUTCMonth() + 1).padStart(2, '0')}.${String(d.getUTCDate()).padStart(2, '0')}`
}

function source(topic: Topic) {
  return `<p class="source-note">참고 출처: <a href="${topic.source.url}" target="_blank" rel="noopener noreferrer">${topic.source.label}</a>. 글의 판단 기준은 공식 정보와 현장 계획 관점으로 재구성했으며, 출발 전 최신 통제·날씨·예약 정보는 반드시 다시 확인하세요.</p>`
}

function seoTitle(topic: Topic, index: number) {
  if (index < 10) return topic.title

  const hasMain = topic.title.includes(topic.main)
  const hasExpanded = topic.related.slice(0, 2).some(keyword => topic.title.includes(keyword))
  if (hasMain && hasExpanded) return topic.title

  const patterns = [
    `${topic.title} — ${topic.main}과 ${topic.related[0]} 기준`,
    `${topic.main} 실전 가이드 — ${topic.related[0]}로 보는 ${topic.title}`,
    `${topic.title}: ${topic.main}·${topic.related[0]} 판단법`,
    `${topic.main} 선택법 — ${topic.title}와 ${topic.related[0]}`,
    `${topic.title} (${topic.main}, ${topic.related[0]} 중심)`,
  ]
  return patterns[index % patterns.length]
}

function seoExcerpt(topic: Topic) {
  const mustHave = [topic.main, topic.related[0], topic.related[1]]
  const missing = mustHave.filter(keyword => !topic.excerpt.includes(keyword))
  if (missing.length === 0) return topic.excerpt
  return `${topic.excerpt} ${missing.join(', ')} 기준까지 함께 정리했습니다.`
}

function openingH2(topic: Topic, index: number) {
  const patterns = [
    `${topic.main}은 추천 목록보다 조건 정리가 먼저입니다`,
    `${topic.main}을 찾는 사람이 먼저 버려야 할 기준`,
    `${topic.main} 빠른 답변과 ${topic.related[0]} 체크포인트`,
    `${topic.main}을 하루 일정으로 바꾸는 실제 순서`,
    `${topic.related[0]} 관점에서 다시 보는 ${topic.main}`,
    `${topic.main}, 유명도보다 ${topic.related[1]}을 보세요`,
    `${topic.main} 검색 전에 정해야 할 세 가지`,
    `${topic.main}이 맞는 사람과 피해야 할 사람`,
    `${topic.related[2]}까지 고려한 ${topic.main} 판단법`,
    `${topic.main} 계획의 출발점은 ${topic.points[0]}입니다`,
  ]
  return patterns[index % patterns.length]
}

function closingH2(topic: Topic, index: number) {
  const patterns = [
    `${topic.main} 최종 점검표`,
    `${topic.related[0]}까지 확인하는 마무리 체크`,
    `${topic.main} 실행 전 마지막 5분`,
    `${topic.related[1]} 기준으로 다시 걸러보기`,
    `${topic.main} 후보를 줄이는 제외 기준`,
  ]
  return patterns[index % patterns.length]
}

function colorCallout(topic: Topic, index: number) {
  const styles = [
    ['#E7F0EA', '#2F4A3C'],
    ['#FFF4D8', '#8A5A00'],
    ['#EAF2FF', '#24527A'],
    ['#F7E9E2', '#8A3F1D'],
  ][index % 4]

  return `<div style="border-left:4px solid ${styles[1]};background:${styles[0]};padding:14px 16px;margin:20px 0;border-radius:6px">
<strong style="color:${styles[1]}">${topic.main} 읽는 법</strong>
<p style="margin:8px 0 0">이 글에서는 ${topic.related[0]}, ${topic.related[1]}을 같은 무게로 봅니다. 색상 박스는 결론과 주의점을 빠르게 찾기 위한 표시이며, 본문 판단 기준은 공식 정보 확인과 안전한 하산 가능성을 우선합니다.</p>
</div>`
}

function formatBlock(topic: Topic, index: number) {
  const blocks = [
    `<h2>${topic.main} 비교 기준표</h2>
<table style="width:100%;border-collapse:collapse;font-size:14px"><thead><tr><th style="padding:8px;border:1px solid var(--line)">판단 항목</th><th style="padding:8px;border:1px solid var(--line)">좋은 신호</th><th style="padding:8px;border:1px solid var(--line)">조정 신호</th></tr></thead><tbody><tr><td style="padding:8px;border:1px solid var(--line)">${topic.related[0]}</td><td style="padding:8px;border:1px solid var(--line)">${topic.points[0]}이 명확함</td><td style="padding:8px;border:1px solid var(--line)">출발·하산 시간이 불분명함</td></tr><tr><td style="padding:8px;border:1px solid var(--line)">${topic.related[1]}</td><td style="padding:8px;border:1px solid var(--line)">${topic.points[1]}을 대체할 수 있음</td><td style="padding:8px;border:1px solid var(--line)">현장 변경이 어려움</td></tr></tbody></table>`,
    `<h2>${topic.main} 하루 흐름 예시</h2>
<ol><li><strong>출발 전날</strong>: ${topic.points[2]}을 확인하고 취소 기준을 정합니다.</li><li><strong>들머리 도착</strong>: ${topic.points[0]}이 계획과 맞는지 점검합니다.</li><li><strong>중간 지점</strong>: ${topic.points[1]}을 기준으로 계속 갈지 판단합니다.</li><li><strong>하산 후</strong>: 실제 시간과 피로도를 기록해 다음 산행 기준으로 남깁니다.</li></ol>`,
    `<h2>${topic.main}에서 흔한 실수 4가지</h2>
<ul><li>${topic.related[0]}만 보고 ${topic.points[0]}을 놓친다.</li><li>${topic.related[1]}을 현장에서 해결할 수 있다고 낙관한다.</li><li>${topic.points[2]}이 바뀌었는데도 원래 계획을 고집한다.</li><li>후기 사진의 분위기와 자신의 체력 조건을 구분하지 않는다.</li></ul>`,
    `<h2>${topic.main} 의사결정 트리</h2>
<p><strong>1단계</strong>: ${topic.points[0]}이 맞으면 후보 유지, 맞지 않으면 제외합니다.</p><p><strong>2단계</strong>: ${topic.points[1]}을 확인할 수 있으면 실행 후보, 불확실하면 짧은 대체 코스로 바꿉니다.</p><p><strong>3단계</strong>: ${topic.points[2]}이 당일 나빠지면 정상 목표를 포기합니다.</p>`,
    `<h2>${topic.reader}를 위한 현장 메모</h2>
<p>${topic.main}은 검색 결과를 많이 볼수록 오히려 판단이 흐려질 수 있습니다. 현장에서는 ${topic.related[0]}보다 ${topic.points[0]}이 먼저이고, ${topic.related[1]}보다 ${topic.points[1]}이 먼저입니다. 이 우선순위만 지켜도 무리한 선택을 상당히 줄일 수 있습니다.</p>`,
    `<h2>${topic.main} 준비물 우선순위</h2>
<ul><li><strong>필수</strong>: ${topic.points[2]} 변화에 대응할 기본 장비와 연락 수단.</li><li><strong>권장</strong>: ${topic.related[0]} 조건에 맞는 보조 장비.</li><li><strong>선택</strong>: 만족도를 높이는 촬영·기록·휴식 도구.</li></ul>`,
    `<h2>${topic.main} 검색 결과를 걸러내는 법</h2>
<p>제목이 자극적인 글보다 날짜, 하산 시간, 통제 확인, 실제 교통을 적은 글을 우선하세요. ${topic.related[2]}처럼 현장성이 큰 키워드는 오래된 글의 정확도가 빠르게 떨어질 수 있습니다.</p>`,
    `<h2>${topic.main} 대체안 만드는 방법</h2>
<p>1안은 원래 목표, 2안은 짧은 회귀형, 3안은 산책형 숲길로 잡으세요. ${topic.points[0]} 또는 ${topic.points[2]}이 틀어지는 순간 바로 2안으로 내려가면 일정 전체가 무너지지 않습니다.</p>`,
    `<h2>${topic.main}을 기록할 때 남길 항목</h2>
<ul><li>실제 출발·하산 시간</li><li>${topic.related[0]} 조건이 맞았는지</li><li>${topic.related[1]} 때문에 생긴 변수</li><li>다음에 줄이거나 늘릴 거리와 휴식</li></ul>`,
    `<h2>${topic.main} 한 문장 결론</h2>
<p>${topic.main}은 ${topic.angle}을 우선할 때 가장 실용적입니다. 유명한 추천을 따라가기보다 ${topic.points[0]}, ${topic.points[1]}, ${topic.points[2]}을 차례대로 확인하는 사람이 더 안전하고 만족스러운 산행을 만듭니다.</p>`,
  ]
  return blocks[index % blocks.length]
}

function faq(topic: Topic) {
  return `<details open><summary><strong>${topic.main}을 처음 준비할 때 가장 먼저 볼 것은 무엇인가요?</strong></summary><p>먼저 ${topic.points[0]}을 확인하고, 그 다음 ${topic.points[1]}과 ${topic.points[2]}을 순서대로 맞추는 것이 좋습니다. 검색 결과의 추천 목록보다 자신의 출발지, 하산 가능 시간, 체력 여유를 먼저 놓고 판단해야 실패 확률이 줄어듭니다.</p></details>
<details><summary><strong>${topic.related[0]}와 ${topic.related[1]} 중 무엇을 우선해야 하나요?</strong></summary><p>${topic.reader}라면 ${topic.related[0]}을 먼저 보세요. 일정이 확정된 뒤에는 ${topic.related[1]}을 보완하면 됩니다. 두 요소가 충돌할 때는 경치나 유명도보다 안전하게 하산할 수 있는 시간표를 우선하는 편이 낫습니다.</p></details>`
}

function qualityAppendix(topic: Topic) {
  return `<h2>${closingH2(topic, topics.indexOf(topic))}</h2>
<p>마지막으로 ${topic.main} 계획을 실행하기 전에는 세 가지를 다시 확인하세요. 첫째, ${topic.points[0]}이 실제 일정표에 반영되어 있어야 합니다. 둘째, ${topic.points[1]}은 현장에서 바꾸기 어려운 조건이므로 출발 전에 대체안을 세워야 합니다. 셋째, ${topic.points[2]}은 산행 당일 아침에 다시 확인해야 하는 변수입니다. 이 세 가지가 모두 충족될 때 검색으로 찾은 추천 정보가 실제 산행 계획으로 바뀝니다.</p>
<p>SEO 관점에서 이 주제의 핵심 질문은 “${topic.main}은 누구에게 적합한가”입니다. 답은 ${topic.reader} 중에서도 ${topic.angle}을 우선하는 사람입니다. 반대로 빠른 인증, 무리한 종주, 날씨 무시, 막차 없는 하산지를 감수해야 하는 일정이라면 이 글의 추천 조건에서 벗어납니다.</p>
<div class="safety"><strong>출발 당일 안전 확인</strong><p>당일 아침에는 날씨 앱 하나만 보지 말고 공식 예보, 탐방로 통제, 하산 교통을 함께 확인하세요. ${topic.related.join(', ')} 조건 중 하나라도 나빠졌다면 코스를 줄이거나 가까운 숲길로 바꾸는 편이 낫습니다. 좋은 산행은 계획대로 끝내는 것이 아니라 안전하게 조정할 수 있을 때 완성됩니다.</p></div>
<p>이미 비슷한 산행을 해봤다면 이번에는 시간을 줄이는 목표보다 기록의 정확도를 높여보세요. 들머리 도착, 첫 휴식, 정상 또는 반환점, 하산 완료 시간을 적으면 다음 산행에서 ${topic.main}과 비슷한 키워드를 훨씬 빠르게 판단할 수 있습니다.</p>
<p>추천을 하나만 고르기 어렵다면 후보를 세 개 이상 늘리지 말고 제외 기준을 적용하세요. ${topic.points[0]}이 맞지 않는 후보, ${topic.points[1]}을 확인할 수 없는 후보, ${topic.points[2]}이 당일 바뀔 가능성이 큰 후보를 차례로 지우면 남는 선택지가 명확해집니다. 이 방식은 검색 결과가 많을수록 더 효과적입니다.</p>
<p>최종 선택은 항상 안전하게 돌아올 수 있는 일정인지로 결정하세요. 같은 정보를 다시 볼 때도 이 기준을 적용하면 불필요한 후보를 빠르게 줄일 수 있습니다.</p>`
}

function body(topic: Topic, index: number) {
  const variants = [
    `<h2>${openingH2(topic, index)}</h2>
<p>${topic.excerpt} 이 글은 ${topic.reader}가 ${topic.angle} 관점에서 바로 판단할 수 있도록 쓴 실전 가이드입니다. ${topic.main}은 단순히 유명한 산이나 인기 코스를 고르는 문제가 아니라, 이동 시간·하산 여유·계절 변수·장비 부담을 함께 맞추는 의사결정입니다.</p>
<p>특히 ${topic.related.join(', ')} 같은 확장 키워드로 검색하는 독자는 이미 막연한 추천보다 구체적인 선택 기준을 원합니다. 아래 기준을 순서대로 적용하면 광고성 추천이나 과장된 후기보다 자기 일정에 맞는 답을 찾기 쉽습니다.</p>
<h2>핵심 판단 기준 3가지</h2>
<ul><li><strong>${topic.points[0]}</strong>: 출발 전 가장 먼저 확인할 항목입니다. 이 조건이 맞지 않으면 코스 난이도나 풍경이 좋아도 일정을 줄이세요.</li><li><strong>${topic.points[1]}</strong>: 실제 만족도를 가르는 요소입니다. 같은 산이라도 접근 방식에 따라 피로도와 비용이 크게 달라집니다.</li><li><strong>${topic.points[2]}</strong>: 마지막 안전장치입니다. 날씨, 통제, 귀가 교통 중 하나라도 불확실하면 대체안을 준비해야 합니다.</li></ul>
<h2>AI 검색이 인용하기 좋은 짧은 답</h2>
<p><strong>${topic.main}</strong>의 핵심은 ${topic.angle}입니다. 초보자는 “가장 유명한 코스”보다 “하산 마감이 넉넉하고 중간 탈출이 가능한 코스”를 고르는 것이 안전합니다. 중급자는 계절 조망, 교통비, 능선 지속 시간을 비교해 선택하면 만족도가 높습니다.</p>
<h2>실전 적용 순서</h2>
<ol><li>출발지에서 들머리까지 실제 도착 시간을 계산합니다.</li><li>정상 도착 목표를 오후 1시 이전으로 잡습니다.</li><li>예상 하산 시간보다 90분 이상 여유를 둡니다.</li><li>대체 코스와 포기 기준을 미리 적어둡니다.</li></ol>
<div class="safety"><strong>안전 메모</strong><p>${topic.points[2]}이 불확실한 날에는 산행 목적을 정상 인증에서 짧은 숲길 걷기로 낮추는 편이 좋습니다. 산에서는 무리한 완주보다 제시간에 내려오는 판단이 더 높은 실력입니다.</p></div>
${colorCallout(topic, index)}
<p>함께 보면 좋은 내부 글은 <a href="${topic.links[0]}">관련 코스 가이드</a>와 <a href="${topic.links[1]}">준비 체크리스트</a>입니다. ${topic.cta}</p>
${source(topic)}${faq(topic)}`,
    `<h2>${openingH2(topic, index)}</h2>
<p>${topic.reader}가 ${topic.main}을 검색할 때 가장 자주 놓치는 부분은 ${topic.points[0]}입니다. 후기 사진은 멋져 보여도 실제 일정에서는 들머리 접근, 화장실·식수 위치, 하산 교통이 더 큰 변수가 됩니다.</p>
<h2>비교표로 보는 선택 기준</h2>
<table style="width:100%;border-collapse:collapse;font-size:14px"><thead><tr><th style="padding:8px;border:1px solid var(--line)">비교 항목</th><th style="padding:8px;border:1px solid var(--line)">우선 확인</th><th style="padding:8px;border:1px solid var(--line)">실패 신호</th></tr></thead><tbody><tr><td style="padding:8px;border:1px solid var(--line)">${topic.related[0]}</td><td style="padding:8px;border:1px solid var(--line)">${topic.points[0]}</td><td style="padding:8px;border:1px solid var(--line)">도착 시간이 늦거나 막차가 빠듯함</td></tr><tr><td style="padding:8px;border:1px solid var(--line)">${topic.related[1]}</td><td style="padding:8px;border:1px solid var(--line)">${topic.points[1]}</td><td style="padding:8px;border:1px solid var(--line)">중간 탈출로가 없고 하산이 길어짐</td></tr><tr><td style="padding:8px;border:1px solid var(--line)">${topic.related[2]}</td><td style="padding:8px;border:1px solid var(--line)">${topic.points[2]}</td><td style="padding:8px;border:1px solid var(--line)">기상·통제 정보가 전날과 다름</td></tr></tbody></table>
<h2>추천 결론</h2>
<p>${topic.angle}라면 처음부터 긴 종주를 잡기보다 짧은 대표 코스와 안전한 하산로를 먼저 고르세요. 반대로 이미 비슷한 난이도를 여러 번 경험했다면 계절 포인트나 조망 능선을 기준으로 확장해도 됩니다.</p>
<p>핵심은 ${topic.main}을 하나의 정답으로 외우지 않는 것입니다. 같은 키워드라도 평일과 주말, 봄과 겨울, 자차와 대중교통 조건이 달라지면 최선의 답도 바뀝니다.</p>
<div class="safety"><strong>출발 전 확인</strong><p>국립공원·산림청·기상청 정보는 하루 전과 당일 새벽이 다를 수 있습니다. 예약제 구간, 낙석 통제, 강풍 예보가 있으면 일정 자체를 바꾸세요.</p></div>
${colorCallout(topic, index)}
<p>더 넓은 계획은 <a href="${topic.links[0]}">연결 가이드</a>에서 잡고, 장비 부담은 <a href="${topic.links[1]}">장비 글</a>로 줄여보세요. ${topic.cta}</p>
${source(topic)}${faq(topic)}`,
    `<h2>${openingH2(topic, index)}</h2>
<p>${topic.main}은 ${topic.angle}에 맞춘 선택형 주제입니다. 정답은 “어느 산이 최고인가”가 아니라 “내 일정에서 어느 조건을 포기하지 않을 것인가”에 가깝습니다. ${topic.reader}라면 아래 체크리스트만 지켜도 검색 피로를 크게 줄일 수 있습니다.</p>
<h2>3분 체크리스트</h2>
<ol><li>${topic.points[0]}을 확인했다.</li><li>${topic.points[1]} 기준으로 후보를 2개 이하로 줄였다.</li><li>${topic.points[2]}이 나쁘면 취소하거나 짧은 코스로 바꾼다.</li></ol>
<h2>검색 의도별 답변</h2>
<p><strong>추천을 찾는 경우</strong>: ${topic.related[0]}을 우선하고, 이동 시간이 긴 후보는 과감히 제외하세요.</p>
<p><strong>비교를 원하는 경우</strong>: ${topic.related[1]}과 ${topic.related[2]}를 나란히 놓고, 하산 후 귀가 가능 시간까지 계산해야 합니다.</p>
<p><strong>초보 산행인 경우</strong>: 정상 인증보다 회귀형 코스, 넓은 등산로, 식수·화장실 접근성을 먼저 보세요.</p>
<h2>이 글의 활용법</h2>
<p>메모 앱에 후보 산 2곳을 적고, 각각 도착 시간·정상 목표·하산 목표·대체 하산로를 기록하세요. 이 네 칸이 채워지지 않는 후보는 아직 계획이 아니라 희망 사항에 가깝습니다.</p>
<div class="safety"><strong>무리 금지 기준</strong><p>정상 도착 예상이 오후 2시 이후로 밀리거나, 비 예보가 40% 이상이고 바람이 강하면 ${topic.main} 계획은 낮은 코스로 조정하는 편이 안전합니다.</p></div>
${colorCallout(topic, index)}
<p>다음 단계로는 <a href="${topic.links[0]}">비슷한 코스 글</a>과 <a href="${topic.links[1]}">안전 준비 글</a>을 이어서 확인하세요. ${topic.cta}</p>
${source(topic)}${faq(topic)}`,
    `<h2>${openingH2(topic, index)}</h2>
<p>${topic.excerpt} 많은 글이 명소를 나열하지만, 실제로 필요한 것은 아침 출발부터 귀가까지 이어지는 순서입니다. ${topic.main}은 ${topic.related.join(', ')}를 함께 봐야 일정이 무너지지 않습니다.</p>
<h2>오전·정오·하산 기준</h2>
<p><strong>오전</strong>: ${topic.points[0]}을 가장 먼저 확인합니다. 들머리 도착이 늦어지면 정상 목표를 낮춥니다.</p>
<p><strong>정오</strong>: ${topic.points[1]}을 기준으로 진행 여부를 판단합니다. 체력이 예상보다 빨리 줄면 조망 포인트까지만 다녀오는 선택도 좋습니다.</p>
<p><strong>하산</strong>: ${topic.points[2]}을 다시 확인합니다. 해가 짧은 계절에는 오후 3시 이후 산 위에 남지 않는 원칙을 세우세요.</p>
<h2>고유 관점</h2>
<p>${topic.angle}라는 관점에서 보면, 이 주제는 단순 정보성 글이 아니라 실패 비용을 줄이는 계획 도구입니다. 검색 상위 글을 여러 개 읽어도 결정이 어렵다면 후보를 더 늘리지 말고 제외 기준을 먼저 정하세요.</p>
<ul><li>제외 기준 1: 막차·주차·예약 중 하나가 불확실하다.</li><li>제외 기준 2: 하산 예상 시간이 일몰 1시간 전보다 늦다.</li><li>제외 기준 3: 동행자의 체력 차이를 반영하지 않았다.</li></ul>
${colorCallout(topic, index)}
<p>관련 글은 <a href="${topic.links[0]}">코스 선택 자료</a>와 <a href="${topic.links[1]}">계절·장비 자료</a>입니다. ${topic.cta}</p>
${source(topic)}${faq(topic)}`,
  ]
  return variants[index % variants.length] + formatBlock(topic, index) + qualityAppendix(topic)
}

function hasBatchim(text: string) {
  const ch = text.trim().at(-1)
  if (!ch) return false
  const code = ch.charCodeAt(0)
  if (code < 0xac00 || code > 0xd7a3) return false
  return (code - 0xac00) % 28 !== 0
}

function eul(text: string) {
  return `${text}${hasBatchim(text) ? '을' : '를'}`
}

function wa(text: string) {
  return `${text}${hasBatchim(text) ? '과' : '와'}`
}

function immediateBody(topic: Topic, index: number) {
  if (index >= 10) return undefined

  const examples = [
    {
      answer: '북한산 우이-도봉, 수락산-불암산, 관악산-삼성산처럼 들머리와 하산 교통이 모두 열린 능선부터 고르는 것이 좋습니다.',
      cases: ['북한산우이역에서 시작해 도봉산역으로 내려오는 능선', '수락산역에서 올라 당고개역으로 내려오는 짧은 연결 산행', '관악산과 삼성산을 잇되 안양 또는 서울대 방향으로 빠지는 코스'],
      trap: '막차 시간만 보고 능선 중간 탈출로를 확인하지 않는 것',
      extra: '새벽 출발이라면 첫차 도착 시간, 정오 전 중간 탈출로 통과 여부, 일몰 2시간 전 하산 가능 여부를 한 장의 메모에 적어두세요.',
    },
    {
      answer: '비 온 다음날에는 정상 조망보다 배수 좋은 숲길, 짧은 회귀형 코스, 계곡 횡단이 적은 길을 우선해야 합니다.',
      cases: ['야자매트나 임도가 섞인 낮은 숲길', '계곡을 따라 걷지만 직접 건너는 지점이 적은 코스', '들머리와 하산지가 같아 중간에 돌아오기 쉬운 회귀형 숲길'],
      trap: '젖은 데크, 이끼 낀 돌계단, 낙엽 덮인 급경사 하산로를 평소 난이도로 보는 것',
      extra: '들머리 10분 안쪽에서 신발에 진흙이 두껍게 붙거나 돌계단이 계속 젖어 있으면 목표를 정상에서 숲길 산책으로 낮추는 편이 낫습니다.',
    },
    {
      answer: '단풍 명산은 가장 예쁜 지점보다 사람이 멈추는 병목 구간을 피하는 계획이 중요합니다.',
      cases: ['정상 왕복 대신 사찰과 숲길을 크게 도는 코스', '절정 주말보다 3-5일 이른 평일 오전 코스', '주차장 한 곳에 몰리지 않는 역방향 하산 코스'],
      trap: '절정 예보만 보고 주차, 셔틀, 하산 대기 시간을 계산하지 않는 것',
      extra: '단풍 산행은 오전 7시 이전 입산, 점심 전 주요 포토존 통과, 오후 2시 이전 하산을 기준으로 잡으면 체감 혼잡이 크게 줄어듭니다.',
    },
    {
      answer: '겨울 초보 산행은 고도보다 하산 시간을 먼저 정해야 합니다. 낮은 산을 고르는 이유도 일몰 전 복귀 가능성이 높기 때문입니다.',
      cases: ['왕복 3시간 이내 원점회귀 코스', '북사면 급경사를 피하고 임도나 계단 우회로가 있는 산', '전철역 또는 버스정류장에서 들머리가 가까운 낮은 산'],
      trap: '아이젠을 챙겼다는 이유로 결빙 하산로와 짧은 해를 과소평가하는 것',
      extra: '정상 도착 목표를 정오 전후로 두고, 오후 1시가 넘었는데 정상까지 1시간 이상 남았다면 돌아서는 기준을 미리 정하세요.',
    },
    {
      answer: 'KTX 명산 여행은 열차역에서 끝나는 일정이 아니라 역, 숙소, 들머리, 하산 후 복귀 열차를 하나로 묶는 일정입니다.',
      cases: ['첫날 저녁 전에 숙소 체크인이 가능한 열차', '역세권보다 다음날 들머리 이동이 쉬운 숙소', '하산 후 샤워와 식사까지 포함해 열차 전 2시간을 비우는 일정'],
      trap: '역 가까운 숙소만 보고 다음날 아침 들머리 이동 수단을 확인하지 않는 것',
      extra: '처음에는 역에서 들머리까지 40분 이내인 산부터 고르세요. 택시가 필요하다면 예상 요금과 호출 가능 시간을 전날 확인해야 합니다.',
    },
    {
      answer: '여름 계곡 산행은 물놀이 포인트보다 상류 예보, 계곡 횡단 횟수, 비가 올 때 빠져나갈 탈출로가 먼저입니다.',
      cases: ['계곡을 보며 걷지만 물을 직접 건너지 않는 길', '오전 안에 마칠 수 있는 짧은 회귀형 코스', '임도나 능선으로 빠지는 우회 탈출로가 표시된 코스'],
      trap: '내가 있는 곳이 맑다는 이유로 상류 소나기와 시간당 강수량을 무시하는 것',
      extra: '물이 갑자기 탁해지거나 나뭇가지가 빠르게 떠내려오면 상류 수위가 변하는 신호입니다. 사진을 찍지 말고 높은 길로 이동하세요.',
    },
    {
      answer: '일출 산행 입문 코스는 해 뜨는 장소보다 어두운 시간에도 길이 분명하고 하산이 쉬운 곳이어야 합니다.',
      cases: ['들머리에서 전망대까지 90분 이내인 코스', '갈림길이 적고 이정표가 자주 나오는 원점회귀 코스', '암릉과 계곡 횡단이 없는 낮은 전망 코스'],
      trap: '스마트폰 플래시만 믿고 헤드랜턴 없이 출발하는 것',
      extra: '일출 시각에서 표준 소요시간의 1.3배를 빼서 출발 시간을 잡으세요. 어둠 속에서는 평소보다 속도가 느립니다.',
    },
    {
      answer: '암릉이 부담스럽다면 정상 조망과 바위 통과를 분리해서 봐야 합니다. 우회로와 중간 전망대가 있는 산이 좋습니다.',
      cases: ['정상 대신 데크 전망대를 목표로 삼는 코스', '난간과 계단이 있어 노출 구간이 짧은 길', '바위 구간 직전에 돌아설 수 있는 갈림길이 있는 산'],
      trap: '후기 사진의 멋진 바위 조망만 보고 우회로 여부를 확인하지 않는 것',
      extra: '현장에서 몸이 굳으면 뒤사람을 의식하지 말고 넓은 지점으로 이동하세요. 돌아서는 판단도 산행 실력입니다.',
    },
    {
      answer: '봄꽃 산행은 개화율만 보지 말고 꽃 군락지에서 사람이 멈추는 밀도와 하산 교통을 함께 봐야 합니다.',
      cases: ['절정 주말 대신 절정 3-5일 전후 평일 코스', '정상 왕복보다 군락지를 크게 도는 회귀 코스', '진달래는 낮은 능선, 철쭉은 늦봄 고도 있는 산으로 나누는 일정'],
      trap: '포토존 한 곳에 모든 일정을 맞춰 산행 흐름을 잃는 것',
      extra: '지도에 사진을 찍을 지점을 두 곳만 표시하고 나머지는 걷는 흐름을 유지하면 피로와 대기 시간이 줄어듭니다.',
    },
    {
      answer: '능선 종주 초보는 10km라는 거리보다 누적고도 700m 이하, 중간 탈출로 2곳 이상, 식수 보급 가능성을 먼저 봐야 합니다.',
      cases: ['8-10km 안에서 끝나는 짧은 연결 능선', '중간에 버스정류장이나 마을로 내려갈 수 있는 코스', '마지막 3km가 급경사 암릉이 아닌 하산로'],
      trap: '평지 10km 감각으로 산의 10km를 계산하는 것',
      extra: '고도 그래프에서 작은 봉우리를 여러 번 넘는 코스는 숫자보다 훨씬 힘듭니다. 거리보다 오르내림 총량을 먼저 보세요.',
    },
  ][index]

  return `<h2>${topic.main}을 검색한 사람이 바로 알아야 할 결론</h2>
<p>${examples.answer} ${topic.excerpt} 이 글은 ${topic.reader}가 ${topic.angle}으로 실제 후보를 줄일 수 있도록 만든 실전 기준입니다. ${topic.related.join(', ')} 같은 검색어로 들어온 독자라면 추천 목록보다 먼저 자신의 출발 시간, 하산 가능 시간, 체력 여유를 놓고 판단해야 합니다.</p>
<div style="border-left:4px solid #2F4A3C;background:#E7F0EA;padding:14px 16px;margin:20px 0;border-radius:6px"><strong style="color:#2F4A3C">핵심 요약</strong><p style="margin:8px 0 0">${examples.extra}</p></div>
<h2>${topic.main} 후보를 줄이는 실제 기준</h2>
<p>첫 번째 기준은 <strong>${topic.points[0]}</strong>입니다. 이 조건이 맞지 않으면 아무리 유명한 코스라도 이번 일정에서는 제외하는 것이 좋습니다. 두 번째는 <strong>${topic.points[1]}</strong>입니다. 같은 거리라도 접근 방식과 하산 조건에 따라 피로가 크게 달라집니다. 마지막은 <strong>${topic.points[2]}</strong>입니다. 이 항목은 산행 당일 변수가 생겼을 때 계획을 유지할지 줄일지 결정하는 안전장치입니다.</p>
<ul><li>${examples.cases[0]}</li><li>${examples.cases[1]}</li><li>${examples.cases[2]}</li></ul>
<h2>많이 하는 실수: ${examples.trap}</h2>
<p>${topic.main}에서 가장 위험한 선택은 검색 결과의 추천 순서를 그대로 따라가는 것입니다. 추천 글은 평균적인 조건을 전제로 하지만, 실제 산행은 출발지, 계절, 날씨, 동행자 체력, 대중교통 시간에 따라 완전히 달라집니다. 특히 ${wa(topic.related[0])} ${topic.related[1]} 조건이 동시에 흔들리면 원래 계획보다 짧은 대체 코스로 바꾸는 편이 안전합니다.</p>
<h2>상황별 선택표</h2>
<table style="width:100%;border-collapse:collapse;font-size:14px"><thead><tr><th style="padding:8px;border:1px solid var(--line)">상황</th><th style="padding:8px;border:1px solid var(--line)">추천 판단</th></tr></thead><tbody><tr><td style="padding:8px;border:1px solid var(--line)">처음 가는 산</td><td style="padding:8px;border:1px solid var(--line)">거리보다 탈출로와 하산 교통을 우선 확인</td></tr><tr><td style="padding:8px;border:1px solid var(--line)">날씨가 애매함</td><td style="padding:8px;border:1px solid var(--line)">정상 목표보다 짧은 회귀형 코스로 축소</td></tr><tr><td style="padding:8px;border:1px solid var(--line)">동행자 체력 차이 큼</td><td style="padding:8px;border:1px solid var(--line)">가장 느린 사람 기준으로 소요시간 계산</td></tr></tbody></table>
<h2>출발 전 5분 체크리스트</h2>
<ol><li>${eul(topic.points[0])} 오늘 일정과 맞춰 확인합니다.</li><li>${eul(topic.points[1])} 기준으로 후보를 2개 이하로 줄입니다.</li><li>${topic.points[2]}에 문제가 생겼을 때 쓸 대체 코스를 정합니다.</li><li>일몰, 막차, 통제, 날씨 정보를 화면 캡처로 저장합니다.</li><li>동행자에게 하산 목표 시간을 공유하고 중간 점검 시간을 정합니다.</li></ol>
<details open><summary><strong>${topic.main}은 초보도 바로 시도해도 되나요?</strong></summary><p>초보도 가능하지만 조건을 줄여야 합니다. 처음이라면 긴 코스보다 짧은 원점회귀, 정상보다 중간 전망대, 유명도보다 하산이 쉬운 길을 고르세요. ${topic.related[2]} 조건이 불확실하면 다음 기회로 미루는 것이 좋습니다.</p></details>
<details><summary><strong>${wa(topic.related[0])} ${topic.related[1]} 중 무엇을 먼저 봐야 하나요?</strong></summary><p>당일 실패를 줄이는 기준은 ${topic.related[0]}입니다. 다만 만족도를 높이는 기준은 ${topic.related[1]}이므로, 안전 조건을 먼저 통과한 후보 안에서 비교하는 순서가 좋습니다.</p></details>
<p>함께 보면 좋은 글은 <a href="${topic.links[0]}">관련 코스 가이드</a>와 <a href="${topic.links[1]}">준비 체크리스트</a>입니다. ${topic.cta}</p>
${source(topic)}`
}

const topics: Topic[] = [
  { cat:'코스추천', pal:'forest', title:'새벽 출발 수도권 능선 산행 — 대중교통 막차까지 계산한 당일 코스', excerpt:'수도권 능선 산행을 새벽 출발 기준으로 정리해 들머리, 하산 시간, 막차 리스크를 함께 판단합니다.', main:'수도권 능선 산행', related:['새벽 출발','대중교통 등산','막차 하산'], angle:'교통 시간표와 하산 여유를 동시에 보는 방식', reader:'차 없이 당일 산행을 계획하는 독자', points:['첫차 도착 시간','하산 지점의 막차','능선 탈출로'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p11','/blog/p5'], cta:'오늘 후보 코스의 막차 시간을 먼저 저장해두세요.' },
  { cat:'코스추천', pal:'sage', title:'비 오는 다음날 걷기 좋은 숲길 — 진흙·계곡·조망 손실을 피하는 선택법', excerpt:'비 온 뒤 산행에서 미끄럼과 진흙을 줄이고 숲길 만족도를 높이는 코스 선택 기준입니다.', main:'비 온 다음날 숲길', related:['젖은 등산로','미끄럼 예방','계곡 수량'], angle:'조망보다 노면과 배수 상태를 우선하는 접근', reader:'비 예보 뒤에도 가벼운 산행을 원하는 독자', points:['배수 좋은 흙길','급경사 우회로','계곡 수위 확인'], source:{label:'국립공원공단',url:'https://www.knps.or.kr'}, links:['/blog/p16','/blog/p17'], cta:'비 온 뒤에는 정상보다 안전한 회귀형 숲길을 우선 후보로 두세요.' },
  { cat:'코스추천', pal:'autumn', title:'단풍 인파 피하는 평일 명산 루트 — 주차장 대신 하산 동선을 먼저 보자', excerpt:'단풍철 혼잡을 줄이기 위해 주차장, 하산로, 평일 시간대를 함께 보는 명산 루트 전략입니다.', main:'단풍 인파 피하는 명산', related:['평일 산행','단풍 코스','주차 혼잡'], angle:'인기 정상보다 병목 구간을 피하는 계획', reader:'단풍은 보고 싶지만 혼잡은 피하고 싶은 독자', points:['평일 오전 출발','하산 병목 우회','주차 대체 지점'], source:{label:'산림청',url:'https://www.forest.go.kr'}, links:['/blog/p9','/blog/p20'], cta:'가고 싶은 산보다 피해야 할 시간대를 먼저 정하세요.' },
  { cat:'코스추천', pal:'winter', title:'겨울 초보가 실패하지 않는 낮은 산 코스 — 아이젠보다 중요한 하산 시간', excerpt:'겨울 초보 산행은 고도보다 하산 시간과 결빙 구간 관리가 중요합니다. 낮은 산 선택 기준을 정리했습니다.', main:'겨울 낮은 산 코스', related:['초보 겨울 산행','아이젠 준비','결빙 하산'], angle:'장비보다 일몰 전 하산을 먼저 보는 원칙', reader:'겨울 산행을 처음 시작하는 독자', points:['일몰 2시간 전 하산','결빙 그늘 구간','짧은 원점회귀'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p14','/blog/p3'], cta:'첫 겨울 산행은 정상 인증보다 제시간 하산을 목표로 잡으세요.' },
  { cat:'코스추천', pal:'sky', title:'KTX로 가능한 1박2일 명산 여행 — 역에서 숙소와 들머리까지 잇는 법', excerpt:'KTX 이동을 활용해 1박2일 명산 여행을 구성할 때 역, 숙소, 들머리 동선을 함께 설계합니다.', main:'KTX 명산 여행', related:['1박2일 등산','역세권 숙소','들머리 이동'], angle:'열차 시간과 숙박 위치로 피로를 줄이는 방식', reader:'자가용 없이 지방 명산을 가려는 독자', points:['첫날 이동 피로','숙소와 들머리 거리','둘째 날 하산 열차'], source:{label:'두루누비',url:'https://www.durunubi.kr'}, links:['/blog/p11','/guide/one-day-plan'], cta:'역에서 들머리까지 40분 이내인 후보부터 비교하세요.' },
  { cat:'코스추천', pal:'valley', title:'여름 계곡 산행 후보 고르기 — 물놀이보다 탈출로가 먼저다', excerpt:'여름 계곡 산행은 시원함만 보고 고르면 위험합니다. 수위, 소나기, 탈출로를 기준으로 후보를 고릅니다.', main:'여름 계곡 산행', related:['계곡 코스','소나기 대응','탈출로'], angle:'물놀이 매력보다 급류와 소나기 리스크를 먼저 보는 기준', reader:'무더위에 계곡 산행을 찾는 독자', points:['오후 소나기 예보','계곡 횡단 구간','우회 탈출로'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p16','/blog/p13'], cta:'계곡 산행 전에는 강수확률보다 시간당 강수와 상류 예보를 확인하세요.' },
  { cat:'코스추천', pal:'dawn', title:'일출 산행 입문 코스 — 어둠 속 길찾기보다 쉬운 하산로가 기준', excerpt:'일출 산행 초보를 위해 헤드랜턴, 길찾기, 하산 동선까지 고려한 입문 코스 선택법입니다.', main:'일출 산행 입문', related:['새벽 등산','헤드랜턴','하산로'], angle:'일출 장소보다 어두운 시간대 이동 난이도를 우선하는 판단', reader:'첫 일출 산행을 준비하는 독자', points:['명확한 등산로','헤드랜턴 예비 배터리','짧은 하산로'], source:{label:'국립공원공단',url:'https://www.knps.or.kr'}, links:['/blog/p16','/blog/p5'], cta:'일출 산행은 올라갈 길보다 내려올 길을 먼저 정하세요.' },
  { cat:'코스추천', pal:'stone', title:'암릉이 무서운 사람을 위한 조망 산행 — 바위 맛은 살리고 위험은 낮추기', excerpt:'암릉 공포가 있는 사람도 조망을 즐길 수 있도록 노출도와 우회로를 기준으로 코스를 고릅니다.', main:'암릉 없는 조망 산행', related:['바위산 우회','고소공포 등산','조망 코스'], angle:'정상 조망과 노출 위험을 분리해서 보는 방식', reader:'바위 구간이 부담스러운 등산객', points:['우회로 존재','난간·계단 구간','노출 능선 길이'], source:{label:'산림청',url:'https://www.forest.go.kr'}, links:['/blog/p7','/blog/p12'], cta:'후기 사진의 바위보다 지도상 우회로 표시를 먼저 확인하세요.' },
  { cat:'코스추천', pal:'spring', title:'봄꽃 산행을 사진보다 편하게 즐기는 법 — 개화율보다 동선 밀도 보기', excerpt:'봄꽃 산행에서 사진 명소만 따라가지 않고 개화 시기, 혼잡, 동선 밀도를 함께 보는 방법입니다.', main:'봄꽃 산행 동선', related:['진달래 산행','철쭉 명소','개화 시기'], angle:'꽃 군락보다 걷는 흐름을 중시하는 계획', reader:'봄꽃 명산을 편하게 즐기려는 독자', points:['개화 고도','군락지 병목','하산 후 교통'], source:{label:'산림청',url:'https://www.forest.go.kr'}, links:['/blog/p15','/blog/p9'], cta:'꽃 절정 주말에는 정상보다 군락지 회귀 코스가 더 만족스러울 수 있습니다.' },
  { cat:'코스추천', pal:'ridge', title:'능선 종주 초보의 첫 10km — 거리보다 누적고도를 먼저 계산하자', excerpt:'10km 능선 종주를 처음 준비할 때 거리 착시를 줄이고 누적고도와 탈출로를 기준으로 판단합니다.', main:'능선 종주 초보', related:['10km 산행','누적고도','종주 탈출로'], angle:'거리보다 오르내림 총량을 보는 기준', reader:'짧은 종주에 처음 도전하는 독자', points:['누적고도 계산','중간 탈출로','식수 보급'], source:{label:'두루누비',url:'https://www.durunubi.kr'}, links:['/blog/p8','/guide/safety-checklist'], cta:'종주 계획표에는 거리보다 누적고도와 탈출 지점을 크게 적어두세요.' },
  { cat:'코스추천', pal:'forest', title:'부모님과 가는 완만한 산책형 산행 — 정상 욕심 없이 만족도 높이는 코스', excerpt:'부모님과 함께하는 산행은 정상보다 휴식 지점, 화장실, 경사 완만함이 만족도를 좌우합니다.', main:'부모님 산책형 산행', related:['가족 등산','완만한 숲길','휴식 지점'], angle:'동행자의 보행 리듬을 기준으로 코스를 낮추는 방법', reader:'부모님과 산에 가려는 가족 독자', points:['화장실 위치','벤치와 쉼터','짧은 원점회귀'], source:{label:'산림청',url:'https://www.forest.go.kr'}, links:['/blog/p2','/guide/beginner-100'], cta:'가족 산행은 정상보다 함께 웃으며 내려오는 시간을 목표로 잡으세요.' },
  { cat:'코스추천', pal:'sunset', title:'노을 보기 좋은 하산 코스 — 야간산행으로 번지지 않는 시간 설계', excerpt:'노을 산행은 아름답지만 하산이 늦어지기 쉽습니다. 안전한 노을 감상과 귀가 기준을 제안합니다.', main:'노을 하산 코스', related:['석양 산행','야간산행 예방','하산 시간'], angle:'풍경 감상과 야간 위험의 경계선을 정하는 계획', reader:'해질녘 조망을 좋아하는 등산객', points:['일몰 70분 전 하산 시작','넓은 하산로','헤드랜턴 준비'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p16','/blog/p5'], cta:'노을 산행은 사진 촬영 종료 시간을 미리 알람으로 맞추세요.' },
  { cat:'코스추천', pal:'island', title:'섬 산행 준비법 — 배 시간표와 바람 예보가 코스 난이도를 바꾼다', excerpt:'섬 산행은 산 높이보다 배 시간, 바람, 결항 가능성이 중요합니다. 당일 계획 기준을 정리했습니다.', main:'섬 산행 준비', related:['배 시간표','해상 바람','섬 등산'], angle:'등산로보다 교통 결항 리스크를 먼저 관리하는 방식', reader:'통영·고흥·강화권 섬 산행을 준비하는 독자', points:['첫 배와 마지막 배','풍랑 예비특보','선착장 이동 시간'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p402','/blog/p83'], cta:'섬 산행은 산행 시간보다 마지막 배 2시간 전 하산을 기준으로 잡으세요.' },
  { cat:'코스추천', pal:'metro', title:'지하철역에서 바로 걷는 짧은 산행 — 퇴근 후 2시간 코스 고르는 법', excerpt:'퇴근 후 짧은 산행을 위해 지하철 접근, 조명, 하산 안전을 기준으로 2시간 코스를 고릅니다.', main:'퇴근 후 지하철 산행', related:['2시간 등산','서울 근교 산','야간 하산'], angle:'짧은 시간에 운동 효과와 안전을 동시에 잡는 기준', reader:'평일 저녁에 산을 걷고 싶은 직장인', points:['역에서 들머리 거리','가로등·인기척','짧은 회귀로'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p1','/blog/p11'], cta:'퇴근 후 산행은 낯선 길보다 이미 걸어본 길에서 시작하세요.' },
  { cat:'코스추천', pal:'mist', title:'운해 보러 가는 산행 계획 — 확률을 높이되 무리하지 않는 새벽 루틴', excerpt:'운해 산행은 기상 조건과 새벽 이동이 맞아야 합니다. 확률을 높이는 기준과 포기 기준을 정리했습니다.', main:'운해 산행 계획', related:['새벽 운해','습도 예보','조망 포인트'], angle:'사진 욕심보다 기상 조건과 하산 체력을 함께 보는 방식', reader:'운해 사진을 기대하는 등산객', points:['전날 강수와 습도','바람 약한 아침','짧은 하산 체력'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p5','/blog/p8'], cta:'운해 확률이 낮은 날에는 숲길 산책으로 목표를 낮추세요.' },
  { cat:'코스추천', pal:'camp', title:'차박 후 새벽 등산 코스 — 주차 가능보다 소음·화장실·하산 동선', excerpt:'차박과 새벽 등산을 결합할 때 주차 가능 여부보다 실제 휴식 품질과 하산 동선이 중요합니다.', main:'차박 새벽 등산', related:['차박 산행','새벽 출발','주차장 매너'], angle:'숙면과 안전 하산을 함께 고려하는 일정 설계', reader:'차박 로드트립과 산행을 묶으려는 독자', points:['화장실 개방 여부','주차장 소음','하산 후 운전 피로'], source:{label:'산림청',url:'https://www.forest.go.kr'}, links:['/blog/p348','/blog/p5'], cta:'차박 산행 다음날 장거리 운전은 최소화하는 동선을 잡으세요.' },
  { cat:'코스추천', pal:'river', title:'강 조망 산행 추천 기준 — 정상 높이보다 전망 방향을 확인하자', excerpt:'강 조망을 기대하는 산행에서는 산 높이보다 능선 방향, 나무 가림, 미세먼지가 만족도를 가릅니다.', main:'강 조망 산행', related:['강변 명산','전망대 코스','미세먼지 조망'], angle:'고도보다 시야 방향과 대기질을 중시하는 선택', reader:'풍경 좋은 산행을 찾는 독자', points:['전망 방향','미세먼지 농도','나무 가림 적은 능선'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p399','/blog/p5'], cta:'조망 산행 전에는 날씨보다 시정과 미세먼지를 같이 확인하세요.' },
  { cat:'코스추천', pal:'temple', title:'사찰 들머리 산행의 장점 — 화장실·식수·문화 동선을 함께 쓰기', excerpt:'사찰을 들머리로 삼는 산행은 편의시설과 문화 탐방을 함께 누릴 수 있지만 혼잡 관리가 필요합니다.', main:'사찰 들머리 산행', related:['문화 산행','화장실 있는 들머리','사찰 코스'], angle:'편의성과 조용한 산행의 균형을 찾는 계획', reader:'산행과 여행을 함께 즐기고 싶은 독자', points:['사찰 개방 시간','주차·화장실 위치','예절과 혼잡 시간'], source:{label:'산림청',url:'https://www.forest.go.kr'}, links:['/blog/p400','/blog/p397'], cta:'사찰 코스는 예불 시간과 관광객 몰리는 시간을 피하면 만족도가 높습니다.' },
  { cat:'코스추천', pal:'beginner', title:'첫 100대 명산 다음 후보 고르기 — 쉬운 산을 반복하지 않는 성장 루트', excerpt:'첫 100대 명산을 마친 뒤 다음 산을 고를 때 난이도, 교통, 계절을 조금씩 확장하는 방법입니다.', main:'두 번째 100대 명산', related:['초보 다음 산','난이도 확장','완등 루트'], angle:'성취감은 유지하고 위험은 천천히 늘리는 선택', reader:'첫 명산을 마친 초보 등산객', points:['이전 산행 피로 기록','난이도 한 단계 상승','계절 변수 최소화'], source:{label:'산림청 100대 명산',url:'https://www.forest.go.kr'}, links:['/blog/p2','/mountains'], cta:'첫 성공 뒤에는 더 유명한 산보다 한 단계만 어려운 산을 고르세요.' },
  { cat:'코스추천', pal:'food', title:'하산 후 식사까지 좋은 산행지 — 맛집보다 귀가 동선이 먼저다', excerpt:'하산 후 식사를 기대하는 산행에서는 맛집 위치보다 대기 시간, 샤워·환복, 귀가 동선이 중요합니다.', main:'하산 후 식사 산행지', related:['등산 맛집 동선','환복 장소','귀가 계획'], angle:'여행 만족도와 귀가 피로를 함께 줄이는 일정', reader:'산행과 지역 식사를 함께 계획하는 독자', points:['하산 지점 식당 거리','환복 가능 장소','식사 후 귀가 교통'], source:{label:'두루누비',url:'https://www.durunubi.kr'}, links:['/guide/one-day-plan','/blog/p8'], cta:'맛집 후보는 하산 지점에서 도보 20분 안쪽으로 제한해보세요.' },
  { cat:'코스추천', pal:'quiet', title:'조용한 평일 산행지 찾기 — 유명산 대신 능선 분산도를 보자', excerpt:'한적한 산행을 원할 때는 이름값보다 등산로 분산도, 주차 규모, 정상 병목을 기준으로 고릅니다.', main:'조용한 평일 산행지', related:['한적한 등산','비인기 코스','능선 분산'], angle:'방문객 수보다 병목 구간을 예측하는 방식', reader:'혼잡을 싫어하는 등산객', points:['등산로 갈래 수','정상 공간 크기','주차장 규모'], source:{label:'산림청',url:'https://www.forest.go.kr'}, links:['/blog/p413','/blog/p398'], cta:'조용한 산행은 유명도 낮은 산보다 분산 가능한 코스를 찾는 것이 핵심입니다.' },
  { cat:'코스추천', pal:'photo', title:'사진 초보를 위한 산행 코스 — 렌즈보다 시간대와 역광 피하기', excerpt:'산 사진을 처음 찍는 등산객을 위해 장비보다 시간대, 조망 방향, 안전한 촬영 지점을 우선합니다.', main:'산행 사진 코스', related:['등산 사진 입문','조망 시간대','역광 피하기'], angle:'촬영 욕심과 산행 안전을 동시에 관리하는 방식', reader:'산에서 사진을 잘 찍고 싶은 초보', points:['해 방향','안전한 촬영 지점','촬영 후 하산 시간'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p5','/blog/p16'], cta:'사진 산행은 촬영 종료 시간을 산행 계획표에 반드시 넣으세요.' },
  { cat:'코스추천', pal:'couple', title:'커플 산행 코스 고르기 — 난이도 차이를 싸움 없이 맞추는 법', excerpt:'동행자 체력이 다를 때 산행 만족도를 높이는 코스 선택과 쉬는 방식, 포기 기준을 정리했습니다.', main:'커플 산행 코스', related:['동행 등산','체력 차이','쉬운 데이트 산행'], angle:'둘 중 약한 사람의 리듬을 기준으로 잡는 계획', reader:'연인이나 배우자와 산행하려는 독자', points:['약한 체력 기준','사진·휴식 지점','중도 하산 합의'], source:{label:'산림청',url:'https://www.forest.go.kr'}, links:['/blog/p2','/guide/beginner-100'], cta:'동행 산행의 성공 기준은 정상보다 다음에도 같이 가고 싶은 기분입니다.' },
  { cat:'코스추천', pal:'training', title:'체력 만들기용 반복 산행 코스 — 기록보다 회복 가능한 루틴 설계', excerpt:'체력 향상을 위해 같은 산을 반복할 때 거리, 고도, 회복일을 조절하는 루틴을 제안합니다.', main:'반복 산행 루틴', related:['등산 체력 훈련','회복일','누적고도'], angle:'한 번의 고강도보다 지속 가능한 반복을 중시하는 방식', reader:'등산 체력을 체계적으로 만들고 싶은 독자', points:['주 1회 반복','누적고도 기록','무릎 피로 체크'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p357','/blog/p8'], cta:'훈련용 산행은 매번 더 세게보다 매번 무리 없이가 먼저입니다.' },
  { cat:'코스추천', pal:'family', title:'아이와 걷는 숲길 산행 — 정상보다 화장실과 탈출로가 핵심', excerpt:'아이 동반 산행은 길이보다 지루함, 화장실, 안전한 탈출로가 중요합니다. 가족 코스 기준을 정리했습니다.', main:'아이와 숲길 산행', related:['가족 숲길','어린이 등산','짧은 코스'], angle:'아이의 집중 시간과 안전을 기준으로 낮추는 선택', reader:'초등 자녀와 산행하려는 가족', points:['화장실 간격','30분 단위 목표','원점회귀 탈출로'], source:{label:'두루누비',url:'https://www.durunubi.kr'}, links:['/guide/beginner-100','/guide/safety-checklist'], cta:'아이와의 첫 산행은 정상보다 다음 쉼터까지를 목표로 나누세요.' },
  { cat:'가이드', pal:'guide', title:'등산 계획표 15분 작성법 — 코스·날씨·교통을 한 장에 끝내기', excerpt:'산행 전 15분 동안 코스, 날씨, 교통, 포기 기준을 한 장에 정리하는 실전 계획법입니다.', main:'등산 계획표 작성법', related:['산행 일정표','교통 계획','포기 기준'], angle:'검색 정보를 실행 가능한 한 장으로 바꾸는 방법', reader:'매번 산행 준비가 어수선한 독자', points:['들머리 도착 시간','정상 목표 시간','포기 기준'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/guide/one-day-plan','/blog/p5'], cta:'다음 산행부터 계획표를 사진으로 저장해 동행자와 공유하세요.' },
  { cat:'가이드', pal:'guide', title:'초보 등산 난이도 읽는 법 — 거리·고도·노면을 따로 봐야 한다', excerpt:'초보가 등산 난이도를 오해하지 않도록 거리, 누적고도, 노면, 계절 변수를 나눠 읽는 법입니다.', main:'등산 난이도 읽는 법', related:['누적고도','등산 거리','노면 상태'], angle:'쉬움·어려움 대신 변수별 난이도로 쪼개는 방식', reader:'코스 난이도 판단이 어려운 초보', points:['누적고도','내리막 길이','돌길·계단 비율'], source:{label:'산림청',url:'https://www.forest.go.kr'}, links:['/guide/beginner-100','/blog/p12'], cta:'후기 난이도보다 숫자와 노면을 함께 기록해보세요.' },
  { cat:'가이드', pal:'guide', title:'하산 시간을 계산하는 현실 공식 — 정상 도착보다 내려오는 속도', excerpt:'하산 시간을 과소평가하지 않도록 내리막 피로, 무릎 부담, 휴식 시간을 포함해 계산합니다.', main:'하산 시간 계산', related:['내리막 속도','무릎 피로','일몰 전 하산'], angle:'등정이 아니라 안전한 귀가를 기준으로 시간을 보는 방법', reader:'매번 하산이 늦어지는 등산객', points:['내리막 평균 속도','휴식 누적 시간','일몰 여유'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p16','/guide/safety-checklist'], cta:'산행 계획에서 하산 시간은 낙관치가 아니라 보수치로 적으세요.' },
  { cat:'가이드', pal:'guide', title:'대중교통 등산 환승 설계 — 첫차보다 돌아오는 차가 더 중요하다', excerpt:'대중교통 산행에서 첫차, 환승, 막차, 택시 대체안을 함께 설계하는 방법입니다.', main:'대중교통 등산 환승', related:['등산 막차','버스 환승','택시 대체'], angle:'갈 때보다 돌아오는 길을 먼저 확정하는 계획', reader:'차 없이 산행하는 독자', points:['하산지 막차','배차 간격','택시 호출 가능 지역'], source:{label:'두루누비',url:'https://www.durunubi.kr'}, links:['/blog/p11','/blog/p1'], cta:'대중교통 산행은 하산지에서 집까지의 경로를 먼저 캡처하세요.' },
  { cat:'가이드', pal:'guide', title:'등산 초보의 첫 스틱 사용법 — 오르막보다 내리막에서 차이가 난다', excerpt:'등산 스틱을 처음 쓰는 사람을 위해 길이 조절, 내리막 사용, 보관 매너를 정리했습니다.', main:'등산 스틱 사용법', related:['스틱 길이 조절','내리막 스틱','무릎 보호'], angle:'장비 구매보다 몸에 맞는 사용 습관을 먼저 익히는 방식', reader:'스틱을 처음 산 초보 등산객', points:['팔꿈치 각도','내리막 짚는 위치','사람 많은 곳 보관'], source:{label:'국립공원공단',url:'https://www.knps.or.kr'}, links:['/blog/p17','/guide/gear-basics'], cta:'스틱은 평지 산책로에서 먼저 연습한 뒤 산에 가져가세요.' },
  { cat:'가이드', pal:'guide', title:'혼자 등산할 때 남겨야 할 정보 — 코스 공유가 생명줄이 된다', excerpt:'혼산 전 가족이나 지인에게 남겨야 할 코스, 시간, 연락 기준을 구체적으로 정리합니다.', main:'혼자 등산 정보 공유', related:['혼산 안전','위치 공유','구조 요청'], angle:'자유로운 산행과 구조 가능성을 함께 확보하는 원칙', reader:'혼자 산행을 자주 하는 독자', points:['예정 코스 공유','하산 예정 알림','연락 두절 기준'], source:{label:'소방청',url:'https://www.nfa.go.kr'}, links:['/blog/p16','/guide/safety-checklist'], cta:'혼산 전에는 “몇 시까지 연락 없으면 신고” 기준을 반드시 정하세요.' },
  { cat:'가이드', pal:'guide', title:'산행 전날 컨디션 점검표 — 잠·수분·발 상태가 코스를 바꾼다', excerpt:'산행 전날 몸 상태를 보고 코스 강도를 낮출지 판단하는 체크리스트입니다.', main:'산행 전날 컨디션', related:['수면 부족 산행','발 물집 예방','수분 준비'], angle:'의지보다 몸 상태를 기준으로 계획을 조정하는 방식', reader:'일정 욕심 때문에 무리하기 쉬운 독자', points:['수면 시간','발바닥 통증','수분 섭취'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p13','/blog/p8'], cta:'전날 컨디션이 나쁘면 산을 바꾸는 것이 실패가 아니라 계획 능력입니다.' },
  { cat:'가이드', pal:'guide', title:'등산 기록을 남기는 법 — 사진보다 다음 산행에 쓸 데이터', excerpt:'등산 후 기록을 다음 계획에 활용할 수 있도록 시간, 피로, 장비, 날씨를 남기는 방법입니다.', main:'등산 기록 남기는 법', related:['산행 로그','피로 기록','장비 메모'], angle:'추억 저장보다 다음 의사결정에 쓰는 기록법', reader:'산행 실력을 꾸준히 키우고 싶은 독자', points:['구간별 시간','피로도 1~5점','다음 수정점'], source:{label:'산림청',url:'https://www.forest.go.kr'}, links:['/tracker','/blog/p357'], cta:'다음 산행부터 정상 사진보다 하산 시간을 꼭 기록하세요.' },
  { cat:'가이드', pal:'guide', title:'산행 동행자 모집 전 확인할 것 — 체력보다 약속 방식이 중요하다', excerpt:'처음 만나는 동행자와 산행할 때 체력, 속도, 포기 기준, 비용 분담을 미리 맞추는 방법입니다.', main:'산행 동행자 체크', related:['등산 모임','페이스 차이','포기 기준'], angle:'좋은 사람보다 합의된 기준이 안전을 만든다는 관점', reader:'등산 모임이나 오픈채팅 산행을 고민하는 독자', points:['평균 속도 합의','중도 하산 기준','교통비 분담'], source:{label:'국립공원공단',url:'https://www.knps.or.kr'}, links:['/guide/safety-checklist','/blog/p2'], cta:'동행 산행 전에는 “느린 사람 기준” 원칙을 먼저 확인하세요.' },
  { cat:'가이드', pal:'guide', title:'등산 앱 지도 쓰는 순서 — 다운로드·배터리·오프라인 확인', excerpt:'등산 앱을 현장에서 믿기 전에 오프라인 지도, 배터리, 위치 보정까지 확인하는 순서입니다.', main:'등산 앱 지도 사용법', related:['오프라인 지도','GPS 배터리','길찾기'], angle:'앱 설치보다 산 안에서 작동하는 조건을 확인하는 방법', reader:'스마트폰 지도를 산에서 쓰려는 독자', points:['오프라인 저장','보조배터리','비행기모드 위치 확인'], source:{label:'국립공원공단',url:'https://www.knps.or.kr'}, links:['/blog/p16','/guide/safety-checklist'], cta:'출발 전 주차장에서 지도가 오프라인으로 열리는지 직접 확인하세요.' },
  { cat:'가이드', pal:'guide', title:'초보가 피해야 할 산행 약속 시간 — 오전 10시 출발이 위험한 이유', excerpt:'늦은 출발이 왜 산행 리스크를 키우는지 일몰, 교통, 체력 관점에서 설명합니다.', main:'늦은 산행 출발 위험', related:['오전 10시 등산','일몰 하산','초보 산행 시간'], angle:'출발 시간 하나가 전체 난이도를 바꾼다는 관점', reader:'느긋한 산행 약속을 잡는 초보', points:['들머리 도착 시각','정상 목표 제한','일몰 2시간 전 하산'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/guide/one-day-plan','/blog/p5'], cta:'초보 산행 약속은 만남 시간이 아니라 들머리 출발 시간을 기준으로 잡으세요.' },
  { cat:'가이드', pal:'guide', title:'등산 중 쉬는 타이밍 — 힘들 때보다 힘들기 전에 멈춰야 한다', excerpt:'체력 고갈을 막기 위해 휴식 간격, 간식, 물 섭취를 계획하는 방법입니다.', main:'등산 휴식 타이밍', related:['간식 섭취','수분 보충','페이스 조절'], angle:'피로가 터진 뒤 쉬는 습관을 예방형 휴식으로 바꾸는 법', reader:'오르막에서 쉽게 지치는 독자', points:['40분 걷고 5분 휴식','작은 간식','숨이 차기 전 속도 조절'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p13','/blog/p8'], cta:'다음 산행에서는 첫 휴식을 힘들기 전에 잡아보세요.' },
  { cat:'가이드', pal:'guide', title:'등산 코스 후기 읽는 법 — 사진보다 날짜와 하산 시간을 보자', excerpt:'블로그 후기에서 실제로 믿을 수 있는 정보와 걸러야 할 표현을 구분하는 방법입니다.', main:'등산 후기 읽는 법', related:['코스 리뷰','하산 시간','계절 차이'], angle:'후기를 감상문이 아니라 계획 데이터로 읽는 방법', reader:'검색 후기가 너무 많아 헷갈리는 독자', points:['작성 날짜','하산 소요 시간','동행자 체력'], source:{label:'산림청',url:'https://www.forest.go.kr'}, links:['/blog/p12','/guide/one-day-plan'], cta:'후기 세 개를 읽었다면 공통으로 반복되는 위험 구간만 따로 적어두세요.' },
  { cat:'가이드', pal:'guide', title:'산행 예산 줄이는 법 — 교통비·식비·장비비를 따로 통제하기', excerpt:'등산 비용을 줄이되 안전을 해치지 않도록 교통, 식비, 장비 구매 우선순위를 정합니다.', main:'산행 예산 줄이는 법', related:['등산 교통비','장비 비용','가성비 산행'], angle:'아낄 비용과 아끼면 안 되는 비용을 분리하는 기준', reader:'등산을 자주 가고 싶지만 비용이 부담되는 독자', points:['대중교통 조합','도시락 준비','안전장비 우선'], source:{label:'두루누비',url:'https://www.durunubi.kr'}, links:['/guide/gear-basics','/blog/p8'], cta:'등산 예산은 신발·우의·보온부터 지키고 나머지에서 줄이세요.' },
  { cat:'가이드', pal:'guide', title:'산행 후 회복 루틴 — 다음날 무릎과 종아리를 덜 아프게 하는 습관', excerpt:'산행 후 스트레칭, 수분, 수면, 기록을 통해 회복을 돕는 현실적인 루틴입니다.', main:'산행 후 회복 루틴', related:['무릎 회복','종아리 통증','등산 후 스트레칭'], angle:'운동 효과보다 다음 산행을 가능하게 하는 회복 관리', reader:'산행 다음날 통증이 심한 독자', points:['하산 직후 정리 걷기','수분과 염분','통증 기록'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p13','/blog/p357'], cta:'산행 후 기록에 통증 위치를 남기면 다음 코스 선택이 쉬워집니다.' },
  { cat:'가이드', pal:'guide', title:'등산 보험과 구조 비용 오해 — 위험한 산행 전에 알아둘 현실', excerpt:'등산 사고, 구조 요청, 여행자보험을 둘러싼 오해를 줄이고 사전 준비 항목을 정리합니다.', main:'등산 보험 준비', related:['산악 사고','구조 요청','여행자보험'], angle:'겁주기가 아니라 사고 후 대응력을 높이는 정보 정리', reader:'원정 산행이나 장거리 산행을 앞둔 독자', points:['보장 범위 확인','동행자 비상연락','구조 요청 기준'], source:{label:'소방청',url:'https://www.nfa.go.kr'}, links:['/blog/p16','/guide/safety-checklist'], cta:'장거리 산행 전에는 보험보다 먼저 연락 체계를 정리하세요.' },
  { cat:'가이드', pal:'guide', title:'산행 속도 맞추는 법 — 빠른 사람보다 느린 사람이 기준이다', excerpt:'동행 산행에서 페이스 차이로 생기는 갈등과 위험을 줄이는 속도 조절법입니다.', main:'산행 속도 맞추기', related:['동행 페이스','느린 사람 기준','휴식 간격'], angle:'팀 산행의 안전은 평균 속도가 아니라 가장 느린 사람에게 달려 있다는 관점', reader:'친구나 모임과 산행하는 독자', points:['선두 속도 제한','정기 휴식','갈림길 대기'], source:{label:'국립공원공단',url:'https://www.knps.or.kr'}, links:['/guide/safety-checklist','/blog/p2'], cta:'다음 동행 산행에서는 선두보다 후미를 챙기는 사람을 정하세요.' },
  { cat:'가이드', pal:'guide', title:'산행 취소 기준 만들기 — 비·바람·컨디션 중 하나만 나빠도 바꿔라', excerpt:'산행을 취소하거나 낮은 코스로 바꾸는 기준을 미리 정해 무리한 출발을 막습니다.', main:'산행 취소 기준', related:['비 예보 등산','강풍 산행','컨디션 저하'], angle:'취소를 실패가 아니라 좋은 계획의 일부로 보는 관점', reader:'일정 확정 후 무리해서 출발하는 독자', points:['강수와 바람','수면 부족','동행자 컨디션'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p5','/guide/safety-checklist'], cta:'산행 전날 취소 기준을 정하면 당일 아침 판단이 쉬워집니다.' },
  { cat:'가이드', pal:'guide', title:'등산로 표지판 해석법 — 거리보다 방향과 고도감을 함께 읽기', excerpt:'표지판의 거리 숫자를 오해하지 않도록 방향, 갈림길, 고도 변화까지 읽는 방법입니다.', main:'등산로 표지판 해석', related:['갈림길 판단','거리 표기','위치 표지목'], angle:'표지판을 남은 거리보다 현재 위치 확인 도구로 쓰는 방식', reader:'갈림길에서 자주 헷갈리는 초보', points:['방향명 확인','표지목 번호 기록','거리와 경사 분리'], source:{label:'국립공원공단',url:'https://www.knps.or.kr'}, links:['/blog/p16','/guide/safety-checklist'], cta:'갈림길에서는 사진 한 장을 남겨 되돌아갈 기준을 만드세요.' },
  { cat:'가이드', pal:'guide', title:'처음 가는 산 주차장 고르는 법 — 무료보다 하산 동선이 중요하다', excerpt:'처음 가는 산에서 주차장을 고를 때 요금보다 하산 지점, 만차 시간, 화장실을 봐야 합니다.', main:'등산 주차장 고르기', related:['만차 시간','하산 지점','화장실 주차장'], angle:'차를 세우는 곳이 산행 난이도를 바꾼다는 관점', reader:'자가용으로 산행지를 찾는 독자', points:['하산 지점 거리','만차 예상 시간','화장실과 매점'], source:{label:'산림청',url:'https://www.forest.go.kr'}, links:['/guide/one-day-plan','/blog/p5'], cta:'주차장은 무료 여부보다 하산 후 20분 안에 돌아올 수 있는지를 보세요.' },
  { cat:'가이드', pal:'guide', title:'등산 초보가 정상 인증에 집착하지 않아도 되는 이유', excerpt:'정상 인증보다 안전한 경험 축적이 더 중요한 이유와 대체 목표 설정법을 설명합니다.', main:'정상 인증 집착 줄이기', related:['초보 등산 목표','중도 하산','산행 만족도'], angle:'완주보다 반복 가능한 경험을 성과로 보는 관점', reader:'정상을 못 가면 실패라고 느끼는 초보', points:['중간 목표 설정','하산 성공 기록','다음 도전 기준'], source:{label:'산림청 100대 명산',url:'https://www.forest.go.kr'}, links:['/guide/beginner-100','/tracker'], cta:'이번 산행의 목표를 정상 하나가 아니라 안전한 귀가까지로 바꿔보세요.' },
  { cat:'안전', pal:'safety', title:'낙뢰 예보가 있는 날 산행 판단 — 능선보다 숲 아래도 위험하다', excerpt:'낙뢰 가능성이 있는 날 산행을 취소해야 하는 이유와 대체 행동 기준을 정리합니다.', main:'낙뢰 예보 산행', related:['천둥 번개','능선 위험','기상 특보'], angle:'비보다 번개 위험을 우선 판단하는 안전 기준', reader:'여름 소나기철 산행을 계획하는 독자', points:['천둥 예보','능선 노출','즉시 하산 기준'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p5','/guide/safety-checklist'], cta:'낙뢰 가능성이 보이면 산행을 미루는 것이 가장 확실한 안전 대책입니다.' },
  { cat:'안전', pal:'safety', title:'저체온은 겨울만의 문제가 아니다 — 비 맞은 봄가을 산행 대응법', excerpt:'봄가을 비바람 속 산행에서 저체온이 생기는 이유와 빠른 대응법을 정리합니다.', main:'봄가을 저체온 산행', related:['비바람 등산','보온 레이어','젖은 옷'], angle:'기온보다 젖음과 바람을 위험 변수로 보는 관점', reader:'간절기 산행을 자주 가는 독자', points:['젖은 옷 교체','바람막이','따뜻한 음료'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p3','/blog/p5'], cta:'비 예보가 있는 간절기에는 얇은 보온층 하나를 반드시 추가하세요.' },
  { cat:'안전', pal:'safety', title:'폭염 산행 중단 기준 — 땀보다 소변 색과 두통을 보자', excerpt:'폭염 산행에서 탈수와 열탈진 신호를 빠르게 읽고 중단 기준을 세우는 방법입니다.', main:'폭염 산행 중단', related:['탈수 증상','열탈진','여름 등산'], angle:'정상 욕심보다 몸의 경고 신호를 우선하는 기준', reader:'여름에도 산행을 이어가려는 독자', points:['두통과 어지럼','소변 색 변화','그늘 휴식'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p13','/guide/safety-checklist'], cta:'폭염 산행은 오전 하산을 원칙으로 하고 이상 신호가 오면 바로 내려오세요.' },
  { cat:'안전', pal:'safety', title:'길을 잃었을 때 되돌아가는 기준 — 새 길 개척은 금물', excerpt:'등산 중 길을 잃었을 때 멈춤, 위치 확인, 되돌아가기, 신고 기준을 정리합니다.', main:'등산 길 잃음 대처', related:['조난 예방','위치 공유','119 신고'], angle:'당황한 이동을 멈추고 마지막 확실한 지점으로 돌아가는 원칙', reader:'혼산이나 낯선 산을 가는 독자', points:['즉시 멈춤','마지막 표지판','119 위치 공유'], source:{label:'소방청',url:'https://www.nfa.go.kr'}, links:['/blog/p16','/guide/safety-checklist'], cta:'길이 애매해지는 순간 더 가기보다 마지막 표지판으로 돌아가세요.' },
  { cat:'안전', pal:'safety', title:'멧돼지 마주쳤을 때 행동 — 뛰지 말고 거리부터 벌려라', excerpt:'산에서 멧돼지를 만났을 때 피해야 할 행동과 천천히 벗어나는 방법을 정리했습니다.', main:'멧돼지 조우 대처', related:['야생동물 산행','소리 내기','거리 확보'], angle:'공포 반응보다 동물의 퇴로를 열어주는 안전 행동', reader:'인적 드문 산길을 걷는 독자', points:['뛰지 않기','새끼 접근 금지','천천히 후퇴'], source:{label:'국립공원공단',url:'https://www.knps.or.kr'}, links:['/blog/p16','/guide/safety-checklist'], cta:'인적 드문 길에서는 이어폰을 빼고 주변 소리를 들으세요.' },
  { cat:'안전', pal:'safety', title:'겨울 결빙 하산 사고 줄이기 — 올라갈 때보다 내려올 때 아이젠', excerpt:'겨울 산행에서 결빙 하산 사고가 많은 이유와 아이젠 착용 타이밍을 설명합니다.', main:'결빙 하산 사고 예방', related:['아이젠 착용','겨울 내리막','낙상 예방'], angle:'정상 직전보다 하산 초반부터 장비를 쓰는 습관', reader:'겨울 산행을 준비하는 독자', points:['그늘 결빙 확인','하산 전 아이젠','보폭 줄이기'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p14','/blog/p3'], cta:'겨울에는 미끄러진 뒤가 아니라 미끄럽기 전에 아이젠을 착용하세요.' },
  { cat:'안전', pal:'safety', title:'등산 중 무릎 통증이 오면 — 참고 내려오지 말고 보폭을 바꿔라', excerpt:'내리막 무릎 통증이 시작됐을 때 속도, 보폭, 스틱, 중도 하산을 판단하는 방법입니다.', main:'등산 무릎 통증 대처', related:['내리막 무릎','스틱 사용','중도 하산'], angle:'통증을 참는 대신 하산 방식을 바꾸는 실전 기준', reader:'하산 때 무릎이 아픈 등산객', points:['보폭 줄이기','스틱 분산','통증 악화 시 중단'], source:{label:'국립공원공단',url:'https://www.knps.or.kr'}, links:['/blog/p13','/blog/p17'], cta:'무릎 통증이 반복되면 다음 산행은 고도보다 노면을 낮춰 잡으세요.' },
  { cat:'안전', pal:'safety', title:'산행 중 벌 쏘임 예방 — 향수보다 음식 쓰레기가 더 위험하다', excerpt:'벌 활동이 많은 계절에 향, 음식물, 어두운 옷, 대처법을 중심으로 안전 수칙을 정리합니다.', main:'벌 쏘임 예방 산행', related:['가을 벌','향수 금지','응급 대처'], angle:'벌을 자극하는 행동을 줄이는 예방 중심 접근', reader:'가을 산행을 준비하는 독자', points:['향 강한 제품 피하기','음식물 밀봉','쏘이면 즉시 하산'], source:{label:'소방청',url:'https://www.nfa.go.kr'}, links:['/blog/p5','/guide/safety-checklist'], cta:'벌 활동 시기에는 달콤한 음료를 열어둔 채 쉬지 마세요.' },
  { cat:'안전', pal:'safety', title:'미세먼지 심한 날 산행해도 될까 — 조망보다 호흡 부담 기준', excerpt:'미세먼지 농도가 높은 날 산행 여부를 판단하고 낮은 강도 코스로 바꾸는 기준입니다.', main:'미세먼지 산행 기준', related:['대기질 등산','호흡 부담','조망 손실'], angle:'풍경보다 호흡 건강과 운동 강도를 우선하는 판단', reader:'날씨는 맑지만 대기질이 나쁜 날 고민하는 독자', points:['대기질 지수','오르막 강도','마스크와 호흡'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p5','/guide/one-day-plan'], cta:'미세먼지가 나쁜 날에는 고강도 오르막 대신 짧은 숲길로 바꾸세요.' },
  { cat:'안전', pal:'safety', title:'야간 하산이 시작됐을 때 — 빠르게 내려오려 하지 말아야 하는 이유', excerpt:'예상보다 늦어져 어두워졌을 때 속도를 줄이고 위치 공유와 헤드랜턴을 우선하는 행동법입니다.', main:'야간 하산 대처', related:['헤드랜턴','늦은 하산','위치 공유'], angle:'서두름이 사고를 키운다는 전제로 행동 순서를 정리', reader:'하산 시간이 늦어진 경험이 있는 독자', points:['헤드랜턴 착용','속도 줄이기','위치 공유'], source:{label:'소방청',url:'https://www.nfa.go.kr'}, links:['/blog/p16','/blog/p5'], cta:'하산이 늦어질 조짐이 보이면 어두워지기 전에 연락부터 남기세요.' },
  { cat:'안전', pal:'safety', title:'계곡 물이 불었을 때 건너지 않는 기준 — 무릎 아래라도 위험하다', excerpt:'비 온 뒤 계곡 횡단이 위험한 이유와 우회·철수 판단 기준을 설명합니다.', main:'계곡 횡단 위험', related:['불어난 계곡','우천 산행','우회로'], angle:'수심보다 유속과 바닥 미끄러움을 먼저 보는 안전 기준', reader:'계곡 코스를 좋아하는 독자', points:['유속 확인','바닥 시야','우회로 선택'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p16','/blog/p5'], cta:'계곡물이 불었으면 등산화가 젖는 문제가 아니라 균형을 잃는 문제로 보세요.' },
  { cat:'안전', pal:'safety', title:'등산 중 휴대폰 배터리 20% 남았을 때 — 사진보다 구조 연락', excerpt:'배터리가 부족해졌을 때 위치 공유, 저전력 모드, 사진 제한 등 우선순위를 정합니다.', main:'등산 배터리 부족 대처', related:['저전력 모드','위치 공유','보조배터리'], angle:'기록보다 연락 가능성을 우선하는 안전 관리', reader:'스마트폰 하나로 산행하는 독자', points:['저전력 모드','위치 문자 전송','사진 촬영 중단'], source:{label:'소방청',url:'https://www.nfa.go.kr'}, links:['/blog/p16','/guide/safety-checklist'], cta:'배터리 20%가 되면 남은 길보다 먼저 현재 위치를 공유하세요.' },
  { cat:'안전', pal:'safety', title:'가을 낙엽길 미끄럼 주의 — 마른 낙엽 아래 젖은 돌이 숨어 있다', excerpt:'가을 낙엽길에서 미끄럼 사고가 생기는 이유와 보행법, 신발 선택 기준을 정리합니다.', main:'가을 낙엽길 미끄럼', related:['단풍 산행 안전','젖은 돌','내리막 보행'], angle:'보기 좋은 낙엽이 노면 정보를 가린다는 관점', reader:'가을 단풍 산행을 준비하는 독자', points:['보폭 줄이기','스틱 사용','낙엽 아래 돌 확인'], source:{label:'국립공원공단',url:'https://www.knps.or.kr'}, links:['/blog/p9','/blog/p17'], cta:'단풍철 내리막에서는 풍경보다 발밑을 보는 시간을 늘리세요.' },
  { cat:'안전', pal:'safety', title:'산행 중 두통이 올 때 — 고도보다 탈수와 열을 먼저 의심하라', excerpt:'산에서 두통이 생겼을 때 탈수, 열, 수면 부족, 고도 변수를 구분하고 대응하는 법입니다.', main:'산행 중 두통 대처', related:['탈수 두통','열탈진','휴식 판단'], angle:'참고 걷기보다 원인을 나눠 빠르게 낮추는 접근', reader:'산행 중 컨디션 저하를 자주 겪는 독자', points:['수분 보충','그늘 휴식','증상 지속 시 하산'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p13','/guide/safety-checklist'], cta:'두통이 시작되면 정상까지 남은 거리보다 회복 여부를 먼저 보세요.' },
  { cat:'안전', pal:'safety', title:'눈꽃 산행 사진 찍다 생기는 사고 — 멈춰 서는 위치가 중요하다', excerpt:'겨울 눈꽃 산행에서 촬영 중 미끄럼, 추락, 체온 저하를 줄이는 촬영 위치 기준입니다.', main:'눈꽃 산행 촬영 안전', related:['겨울 사진 산행','미끄럼 예방','촬영 위치'], angle:'좋은 구도보다 안전하게 설 수 있는 곳을 먼저 찾는 기준', reader:'겨울 산 사진을 찍는 독자', points:['평평한 촬영 위치','장갑 유지','동행자 통행 방해 금지'], source:{label:'국립공원공단',url:'https://www.knps.or.kr'}, links:['/blog/p14','/blog/p3'], cta:'눈꽃 사진은 한 발 더 나가서가 아니라 한 발 물러서서 찍는 편이 안전합니다.' },
  { cat:'안전', pal:'safety', title:'산불 위험 시기 산행 매너 — 취사 금지보다 작은 불씨 관리', excerpt:'건조한 계절 산불 위험을 줄이기 위해 흡연, 버너, 쓰레기, 신고 기준을 정리합니다.', main:'산불 위험 산행 매너', related:['건조주의보','취사 금지','흡연 금지'], angle:'개인 편의보다 산림 전체 위험을 낮추는 행동 기준', reader:'봄가을 건조기 산행을 준비하는 독자', points:['화기 사용 금지','흡연 금지','연기 발견 신고'], source:{label:'산림청',url:'https://www.forest.go.kr'}, links:['/blog/p5','/guide/safety-checklist'], cta:'건조주의보가 있는 날에는 산에서 불을 쓰는 모든 행동을 제외하세요.' },
  { cat:'장비', pal:'gear', title:'등산화 밑창 패턴 고르기 — 접지력은 고무보다 노면 궁합이다', excerpt:'등산화 밑창을 고를 때 브랜드보다 흙길, 바위, 젖은 돌 등 노면 궁합을 기준으로 봅니다.', main:'등산화 밑창 패턴', related:['접지력','젖은 돌','흙길 등산화'], angle:'제품 스펙보다 자주 걷는 노면을 기준으로 고르는 방식', reader:'등산화를 새로 사려는 독자', points:['자주 가는 노면','러그 깊이','젖은 바위 접지'], source:{label:'국립공원공단',url:'https://www.knps.or.kr'}, links:['/blog/p17','/guide/gear-basics'], cta:'등산화는 산 이름보다 가장 자주 밟는 노면을 기준으로 고르세요.' },
  { cat:'장비', pal:'gear', title:'여름 등산 양말 선택 — 얇기보다 땀 배출과 마찰 관리', excerpt:'여름 등산 양말은 얇은 제품보다 땀 배출, 쿠션, 마찰 관리가 더 중요합니다.', main:'여름 등산 양말', related:['물집 예방','땀 배출','쿠션 양말'], angle:'시원함과 물집 예방의 균형을 찾는 선택', reader:'여름에 발이 쉽게 젖는 등산객', points:['흡습 속건 소재','뒤꿈치 쿠션','여분 양말'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p17','/blog/p13'], cta:'여름 장거리 산행에는 양말 한 켤레를 여분으로 챙기세요.' },
  { cat:'장비', pal:'gear', title:'비싼 배낭보다 먼저 볼 것 — 등판 길이와 허리벨트 맞춤', excerpt:'배낭 구매 전 용량보다 등판 길이, 허리벨트, 어깨끈 균형을 먼저 확인하는 방법입니다.', main:'등산 배낭 등판 길이', related:['허리벨트','배낭 피팅','어깨 통증'], angle:'브랜드보다 몸에 맞는 피팅을 우선하는 선택', reader:'배낭 구매를 고민하는 초보', points:['등판 길이','허리벨트 위치','어깨끈 압박'], source:{label:'산림청',url:'https://www.forest.go.kr'}, links:['/blog/p8','/guide/gear-basics'], cta:'배낭은 매장에서 무게를 넣고 10분 이상 메본 뒤 결정하세요.' },
  { cat:'장비', pal:'gear', title:'초경량 바람막이 고르기 — 방수 재킷과 역할을 나눠야 한다', excerpt:'바람막이와 방수 재킷의 역할 차이를 이해하고 계절별로 어떻게 챙길지 정리합니다.', main:'초경량 바람막이', related:['방수 재킷 차이','레이어링','간절기 등산복'], angle:'한 벌로 모든 날씨를 해결하려는 오해를 줄이는 선택', reader:'등산 의류를 처음 맞추는 독자', points:['방풍 목적','방수 한계','보온층 조합'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p3','/guide/gear-basics'], cta:'바람막이는 비옷이 아니라 체온 손실을 줄이는 얇은 레이어로 보세요.' },
  { cat:'장비', pal:'gear', title:'보조배터리 산행 세팅 — 용량보다 케이블과 방수 보관', excerpt:'산행 중 스마트폰 배터리를 지키기 위해 보조배터리 용량, 케이블, 방수 보관을 정리합니다.', main:'등산 보조배터리 세팅', related:['케이블 예비','방수 파우치','저전력 모드'], angle:'큰 용량보다 실제 연결 가능성을 우선하는 준비', reader:'지도 앱을 많이 쓰는 등산객', points:['짧은 케이블','방수 보관','저전력 모드'], source:{label:'소방청',url:'https://www.nfa.go.kr'}, links:['/blog/p16','/guide/safety-checklist'], cta:'보조배터리는 충전 여부보다 케이블이 맞는지 먼저 확인하세요.' },
  { cat:'장비', pal:'gear', title:'등산 모자 선택법 — 햇빛 차단과 땀 배출을 계절별로 나누기', excerpt:'등산 모자를 고를 때 챙 넓이, 통풍, 보온, 바람 저항을 계절별로 구분합니다.', main:'등산 모자 선택법', related:['햇빛 차단','통풍 모자','겨울 비니'], angle:'멋보다 체온과 시야를 관리하는 장비로 보는 선택', reader:'계절별 모자가 헷갈리는 초보', points:['챙 넓이','통풍 구조','바람 고정'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/guide/gear-basics','/blog/p13'], cta:'여름에는 햇빛 차단, 겨울에는 귀 보온을 기준으로 모자를 나누세요.' },
  { cat:'장비', pal:'gear', title:'등산 장갑 사계절 구분 — 손끝 감각이 안전장비가 되는 순간', excerpt:'등산 장갑을 계절별로 고르는 법과 암릉, 겨울, 비 오는 날의 손 보호 기준입니다.', main:'등산 장갑 사계절', related:['암릉 장갑','방한 장갑','젖은 장갑'], angle:'손 보호를 체온과 균형 감각의 일부로 보는 관점', reader:'장갑을 대충 고르던 등산객', points:['손바닥 마찰','젖어도 보온','예비 장갑'], source:{label:'국립공원공단',url:'https://www.knps.or.kr'}, links:['/blog/p3','/guide/gear-basics'], cta:'겨울 장거리 산행에는 얇은 장갑과 보온 장갑을 분리해서 챙기세요.' },
  { cat:'장비', pal:'gear', title:'등산 우의와 판초 비교 — 배낭까지 덮을지 몸만 지킬지', excerpt:'우의, 판초, 방수 재킷의 차이를 배낭 보호와 활동성 기준으로 비교합니다.', main:'등산 우의 판초 비교', related:['방수 재킷','배낭 커버','우천 산행'], angle:'비를 완전히 막기보다 젖어도 위험하지 않게 관리하는 선택', reader:'비 예보 산행 장비가 고민인 독자', points:['배낭 보호','통풍성','바람 취약성'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p5','/guide/gear-basics'], cta:'비 산행에는 몸, 배낭, 여벌 옷을 각각 어떻게 지킬지 나눠보세요.' },
  { cat:'장비', pal:'gear', title:'물통과 하이드레이션 선택 — 자주 마실 수 있는 구조가 이긴다', excerpt:'물통과 하이드레이션 팩을 비교해 산행 거리와 계절별 수분 보충 방식을 정리합니다.', main:'등산 물통 하이드레이션', related:['수분 보충','하이드레이션 팩','물통 용량'], angle:'총 용량보다 마시는 빈도를 높이는 장비 선택', reader:'산행 중 물을 자주 못 마시는 독자', points:['마시기 쉬운 위치','세척 편의','계절별 용량'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p13','/blog/p8'], cta:'물은 많이 챙기는 것보다 자주 마실 수 있게 배치하는 것이 중요합니다.' },
  { cat:'장비', pal:'gear', title:'헤드랜턴 밝기보다 중요한 것 — 배터리 시간과 각도 조절', excerpt:'헤드랜턴을 고를 때 루멘 숫자보다 사용 시간, 각도, 예비 전원을 우선합니다.', main:'등산 헤드랜턴 선택', related:['루멘 밝기','배터리 시간','야간 하산'], angle:'밝기 경쟁보다 끝까지 켜지는 안정성을 중시하는 기준', reader:'일출·야간 산행을 준비하는 독자', points:['사용 시간','각도 조절','예비 배터리'], source:{label:'소방청',url:'https://www.nfa.go.kr'}, links:['/blog/p16','/blog/p5'], cta:'헤드랜턴은 산에 가기 전 어두운 계단에서 먼저 테스트하세요.' },
  { cat:'장비', pal:'gear', title:'무릎보호대 언제 써야 할까 — 의존보다 하산 보조로 보기', excerpt:'무릎보호대를 장거리 하산에서 어떻게 쓰고, 언제 병원 상담이 필요한지 정리합니다.', main:'등산 무릎보호대 사용', related:['내리막 통증','보호대 의존','하산 보조'], angle:'보호대를 치료가 아니라 부담 분산 도구로 보는 관점', reader:'무릎 통증이 걱정되는 등산객', points:['하산 전 착용','압박감 조절','통증 지속 시 중단'], source:{label:'국립공원공단',url:'https://www.knps.or.kr'}, links:['/blog/p13','/blog/p17'], cta:'보호대가 있어도 통증이 커지면 코스를 줄이는 판단이 먼저입니다.' },
  { cat:'장비', pal:'gear', title:'등산 간식 조합 — 초콜릿 하나보다 짠맛과 수분 균형', excerpt:'산행 중 에너지 저하를 막기 위해 단맛, 짠맛, 수분을 어떻게 조합할지 설명합니다.', main:'등산 간식 조합', related:['에너지 보충','염분 보충','행동식'], angle:'칼로리보다 먹기 쉬운 빈도와 균형을 보는 기준', reader:'산행 중 쉽게 지치는 독자', points:['작은 포장','짠맛 포함','물과 함께 섭취'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p13','/blog/p8'], cta:'간식은 배고플 때 먹는 음식이 아니라 지치기 전 넣는 연료입니다.' },
  { cat:'장비', pal:'gear', title:'등산 선글라스 필요할까 — 눈부심보다 눈 피로와 설맹 예방', excerpt:'등산 선글라스가 필요한 계절과 지형, 렌즈 선택 기준을 정리합니다.', main:'등산 선글라스 필요성', related:['눈 피로','설맹 예방','자외선 차단'], angle:'멋보다 시야와 눈 건강을 지키는 장비로 보는 관점', reader:'선글라스 구매를 고민하는 독자', points:['자외선 차단','렌즈 어두움','겨울 눈 반사'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p14','/guide/gear-basics'], cta:'눈길이나 고산 능선을 간다면 선글라스를 선택 장비로 보지 마세요.' },
  { cat:'장비', pal:'gear', title:'여벌 옷을 줄이는 등산 패킹 — 가볍게가 아니라 마르게 유지하기', excerpt:'배낭 무게를 줄이면서도 저체온을 막기 위해 여벌 옷 우선순위를 정리합니다.', main:'등산 여벌 옷 패킹', related:['레이어링','저체온 예방','배낭 무게'], angle:'옷 개수보다 마른 보온층을 확보하는 방식', reader:'배낭을 가볍게 만들고 싶은 독자', points:['마른 베이스레이어','방수 포장','하산 후 환복'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p3','/blog/p8'], cta:'여벌 옷은 많게보다 젖지 않게 보관하는 것이 핵심입니다.' },
  { cat:'장비', pal:'gear', title:'등산 비상키트 최소 구성 — 많이보다 바로 꺼낼 수 있어야 한다', excerpt:'비상키트에 꼭 넣을 물품과 배낭 안 배치, 동행자 공유 기준을 정리합니다.', main:'등산 비상키트 구성', related:['응급 처치','호루라기','비상담요'], angle:'소지 여부보다 빠르게 사용할 수 있는 배치를 중시', reader:'안전 장비를 갖추려는 초보', points:['비상담요','호루라기','상처 처치품'], source:{label:'소방청',url:'https://www.nfa.go.kr'}, links:['/blog/p16','/guide/safety-checklist'], cta:'비상키트는 배낭 깊숙한 곳이 아니라 바로 꺼낼 수 있는 곳에 두세요.' },
  { cat:'장비', pal:'gear', title:'등산 바지 고르는 법 — 신축성보다 무릎 움직임과 건조 속도', excerpt:'등산 바지를 고를 때 계절, 신축성, 건조 속도, 주머니 위치를 비교합니다.', main:'등산 바지 고르는 법', related:['신축성','속건 바지','무릎 움직임'], angle:'패션보다 보행과 건조를 우선하는 선택', reader:'청바지를 벗어나 등산복을 준비하는 독자', points:['무릎 굽힘','속건 소재','허리 압박'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/guide/gear-basics','/blog/p8'], cta:'등산 바지는 매장에서 앉았다 일어나보며 무릎 당김을 확인하세요.' },
  { cat:'계절', pal:'season', title:'장마철 산행을 쉬어야 하는 날 — 강수확률보다 누적강수량', excerpt:'장마철에는 비가 그친 뒤에도 등산로가 위험할 수 있습니다. 누적강수량과 계곡 수위를 기준으로 봅니다.', main:'장마철 산행 기준', related:['누적강수량','계곡 수위','우천 통제'], angle:'당일 비 예보보다 전날까지 쌓인 물을 보는 관점', reader:'장마 중 산행 일정을 고민하는 독자', points:['누적강수량','계곡 횡단','사면 붕괴 위험'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p5','/blog/p16'], cta:'장마철에는 비가 멈췄다는 이유만으로 바로 산에 가지 마세요.' },
  { cat:'계절', pal:'season', title:'초가을 산행 복장 — 한낮 더위와 해진 뒤 냉기를 같이 준비', excerpt:'초가을 산행은 낮과 저녁의 온도 차가 커 복장과 하산 시간을 함께 계획해야 합니다.', main:'초가을 산행 복장', related:['일교차 등산','바람막이','하산 냉기'], angle:'출발 기온보다 하산 시간의 체감온도를 보는 방식', reader:'가을 산행 복장이 헷갈리는 독자', points:['일교차 확인','얇은 보온층','땀 식기 전 환복'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p9','/blog/p3'], cta:'초가을에는 반팔 출발이라도 배낭에 얇은 긴팔을 넣어두세요.' },
  { cat:'계절', pal:'season', title:'봄 황사 날 산행 대안 — 정상 대신 낮은 숲길을 고르는 이유', excerpt:'황사와 미세먼지가 있는 봄날 산행 강도를 낮추고 숲길 대안을 고르는 기준입니다.', main:'황사 날 산행 대안', related:['봄 미세먼지','낮은 숲길','호흡 부담'], angle:'조망 손실보다 호흡 부담을 줄이는 선택', reader:'봄마다 산행 일정을 잡는 독자', points:['대기질 확인','오르막 강도 낮추기','짧은 숲길 대체'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p5','/guide/one-day-plan'], cta:'황사가 심한 날에는 인증 산행보다 낮은 숲길 걷기로 전환하세요.' },
  { cat:'계절', pal:'season', title:'첫눈 온 다음날 산행 — 설경보다 결빙과 통제가 먼저다', excerpt:'첫눈 뒤 산행에서 설경 기대보다 결빙, 통제, 장비 여부를 먼저 판단해야 합니다.', main:'첫눈 산행 주의', related:['눈 온 다음날','결빙 통제','겨울 장비'], angle:'예쁜 설경보다 아직 준비되지 않은 등산로 위험을 보는 관점', reader:'첫눈 소식에 산을 가고 싶은 독자', points:['탐방로 통제','아이젠 준비','하산 결빙'], source:{label:'국립공원공단',url:'https://www.knps.or.kr'}, links:['/blog/p14','/blog/p3'], cta:'첫눈 다음날은 낮은 산 짧은 코스로 장비 감각을 먼저 익히세요.' },
  { cat:'계절', pal:'season', title:'벚꽃 산행과 진달래 산행 차이 — 낮은 고도와 능선 고도 읽기', excerpt:'봄꽃 산행에서 벚꽃과 진달래의 시기와 고도 차이를 이해해 일정을 잡습니다.', main:'벚꽃 진달래 산행 차이', related:['봄꽃 개화','고도별 개화','능선 꽃길'], angle:'꽃 종류별 고도와 시기 차이를 일정에 반영하는 방법', reader:'봄꽃 산행을 계획하는 독자', points:['낮은 고도 벚꽃','능선 진달래','주말 혼잡'], source:{label:'산림청',url:'https://www.forest.go.kr'}, links:['/blog/p15','/blog/p9'], cta:'봄꽃 산행은 한 주 차이로 풍경이 바뀌니 고도까지 함께 보세요.' },
  { cat:'계절', pal:'season', title:'여름 새벽 산행의 장단점 — 더위는 피하지만 잠 부족이 온다', excerpt:'여름 새벽 산행이 폭염을 피하는 데 유리하지만 수면 부족과 어둠 리스크를 함께 봐야 합니다.', main:'여름 새벽 산행', related:['폭염 회피','수면 부족','새벽 하산'], angle:'기온 이점과 컨디션 손실을 동시에 평가하는 기준', reader:'더위를 피해 새벽 출발을 고민하는 독자', points:['전날 수면','헤드랜턴','오전 하산'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p13','/blog/p16'], cta:'여름 새벽 산행은 전날 일찍 자는 것부터 준비입니다.' },
  { cat:'계절', pal:'season', title:'가을 단풍 절정 주말 피하기 — 색보다 사람 흐름을 예측하자', excerpt:'단풍 절정 주말의 혼잡을 피해 평일, 이른 시간, 대체 코스를 고르는 방법입니다.', main:'단풍 절정 주말 피하기', related:['단풍 혼잡','평일 산행','대체 코스'], angle:'단풍 색보다 병목과 귀가 정체를 먼저 보는 관점', reader:'가을 산행 혼잡을 싫어하는 독자', points:['이른 들머리 도착','하산 시간 분산','대체 능선'], source:{label:'산림청',url:'https://www.forest.go.kr'}, links:['/blog/p9','/blog/p20'], cta:'단풍 절정에는 가장 유명한 입구보다 한 정거장 떨어진 들머리를 찾아보세요.' },
  { cat:'계절', pal:'season', title:'겨울 바람 센 능선 피하기 — 기온보다 체감온도가 산행을 바꾼다', excerpt:'겨울 능선 산행에서 실제 위험을 만드는 체감온도와 바람 노출을 기준으로 코스를 조정합니다.', main:'겨울 능선 바람', related:['체감온도','방풍 레이어','능선 노출'], angle:'온도 숫자보다 바람에 노출되는 시간을 보는 방식', reader:'겨울 능선 산행을 준비하는 독자', points:['풍속 확인','노출 능선 길이','방풍 장비'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p14','/blog/p3'], cta:'겨울에는 정상 온도보다 능선 풍속을 먼저 확인하세요.' },
  { cat:'계절', pal:'season', title:'5월 철쭉 산행 예약 전략 — 꽃보다 주차와 입산 마감', excerpt:'철쭉 시즌 산행은 개화 정보와 함께 주차, 예약, 입산 마감 시간을 봐야 합니다.', main:'철쭉 산행 예약', related:['5월 철쭉','입산 마감','주차 혼잡'], angle:'꽃 절정보다 접근 병목을 먼저 관리하는 계획', reader:'철쭉 명산을 찾는 독자', points:['개화 공지','입산 마감','주차 대체지'], source:{label:'국립공원 예약시스템',url:'https://res.knps.or.kr'}, links:['/blog/p15','/blog/p20'], cta:'철쭉 산행은 개화율 확인 후 바로 주차와 입산 시간을 맞추세요.' },
  { cat:'계절', pal:'season', title:'11월 늦가을 산행 매력 — 낙엽 이후 조망이 열리는 산 고르기', excerpt:'단풍이 끝난 11월에도 조망과 한적함을 즐길 수 있는 산행 기준을 정리합니다.', main:'11월 늦가을 산행', related:['낙엽 후 조망','한적한 산행','초겨울 준비'], angle:'단풍 이후의 시야와 고요함을 즐기는 선택', reader:'성수기 이후 산행을 좋아하는 독자', points:['낙엽 후 조망','짧아진 해','얇은 보온층'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p9','/guide/gear-basics'], cta:'11월 산행은 조망은 좋아지지만 해가 짧아진다는 점을 잊지 마세요.' },
  { cat:'계절', pal:'season', title:'해빙기 산행이 까다로운 이유 — 눈은 녹아도 낙석은 늘어난다', excerpt:'해빙기에는 눈보다 낙석, 진흙, 얼음이 섞여 산행 난이도가 올라갑니다.', main:'해빙기 산행 주의', related:['낙석 위험','진흙길','잔설 결빙'], angle:'봄처럼 보여도 겨울 위험이 남아 있다는 관점', reader:'3월 산행을 준비하는 독자', points:['탐방로 통제','낙석 구간','잔설 장비'], source:{label:'국립공원공단',url:'https://www.knps.or.kr'}, links:['/blog/p5','/guide/safety-checklist'], cta:'해빙기에는 높은 산보다 관리된 낮은 숲길로 몸을 풀어보세요.' },
  { cat:'계절', pal:'season', title:'여름 소나기 예보 읽기 — 강수확률보다 시간대가 중요하다', excerpt:'여름 산행에서 소나기 예보를 볼 때 강수확률, 시간대, 하산 계획을 함께 판단합니다.', main:'여름 소나기 예보', related:['강수확률','오후 소나기','계곡 위험'], angle:'비가 오느냐보다 언제 어디서 맞느냐를 보는 기준', reader:'여름 산행 일정을 고민하는 독자', points:['오후 강수 시간','계곡 회피','오전 하산'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p5','/blog/p16'], cta:'소나기 예보가 있으면 정상 목표를 오전 중으로 앞당기세요.' },
  { cat:'계절', pal:'season', title:'겨울 눈 없는 산행의 장점 — 조망과 한적함을 얻는 대신 바람 대비', excerpt:'눈꽃이 없어도 겨울 산행은 조망과 한적함이 좋습니다. 대신 바람과 결빙을 관리해야 합니다.', main:'눈 없는 겨울 산행', related:['겨울 조망','한적한 산행','바람 대비'], angle:'눈꽃만 겨울 산행의 가치가 아니라는 관점', reader:'눈꽃이 없어 아쉬운 겨울 등산객', points:['맑은 시정','찬 바람','그늘 결빙'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p14','/blog/p3'], cta:'눈이 없는 겨울에는 조망 좋은 낮은 능선을 후보로 올려보세요.' },
  { cat:'계절', pal:'season', title:'초여름 녹음 산행 코스 — 꽃은 졌지만 숲 그늘이 시작된다', excerpt:'초여름 산행에서 꽃 시즌 이후 숲 그늘, 계곡 바람, 벌레 대비를 기준으로 코스를 고릅니다.', main:'초여름 녹음 산행', related:['숲 그늘','계곡 바람','벌레 대비'], angle:'꽃 대신 걷기 쾌적함을 즐기는 계절 선택', reader:'6월 산행지를 찾는 독자', points:['그늘 비율','계곡 접근','벌레 기피 준비'], source:{label:'산림청',url:'https://www.forest.go.kr'}, links:['/blog/p15','/guide/gear-basics'], cta:'초여름에는 조망 능선보다 그늘 많은 숲길을 우선해보세요.' },
  { cat:'계절', pal:'season', title:'명절 연휴 산행 계획 — 고속도로보다 들머리 혼잡이 변수', excerpt:'명절 연휴 산행에서 교통 정체와 들머리 혼잡을 피해 일정을 설계하는 방법입니다.', main:'명절 연휴 산행', related:['연휴 등산','고속도로 정체','주차 혼잡'], angle:'연휴 이동 피로와 산행 피로를 함께 줄이는 계획', reader:'긴 연휴에 산행을 넣고 싶은 독자', points:['전날 이동','이른 하산','대체 주차장'], source:{label:'두루누비',url:'https://www.durunubi.kr'}, links:['/guide/one-day-plan','/blog/p5'], cta:'연휴 산행은 가장 유명한 산보다 귀가가 쉬운 산이 더 좋은 선택입니다.' },
  { cat:'후기', pal:'story', title:'첫 혼산에서 배운 것 — 자유보다 준비가 먼저였다', excerpt:'첫 혼자 산행에서 느낀 자유와 불안을 바탕으로 코스 공유, 하산 시간, 장비 준비를 복기합니다.', main:'첫 혼산 후기', related:['혼자 등산','코스 공유','하산 불안'], angle:'낭만보다 준비가 혼산의 자유를 지켜준다는 경험담', reader:'혼산을 시작하려는 독자', points:['코스 공유','낮은 난이도','하산 알림'], source:{label:'소방청',url:'https://www.nfa.go.kr'}, links:['/blog/p16','/guide/safety-checklist'], cta:'첫 혼산은 익숙한 산의 짧은 코스에서 시작하세요.' },
  { cat:'후기', pal:'story', title:'비 예보를 무시한 산행 복기 — 젖은 양말 하나가 하루를 바꿨다', excerpt:'비 예보를 가볍게 보고 출발했다가 젖은 발과 체온 저하로 고생한 산행을 복기합니다.', main:'비 예보 산행 실패', related:['젖은 양말','우의 준비','저체온'], angle:'작은 준비 부족이 전체 산행을 무너뜨린 사례', reader:'비 예보를 대수롭지 않게 보는 독자', points:['여벌 양말','방수 포장','짧은 코스 전환'], source:{label:'기상청 날씨누리',url:'https://www.weather.go.kr'}, links:['/blog/p5','/blog/p3'], cta:'비 예보가 있으면 양말과 보온층만큼은 방수팩에 따로 넣으세요.' },
  { cat:'후기', pal:'story', title:'막차를 놓칠 뻔한 대중교통 산행 — 하산지가 출발지만큼 중요했다', excerpt:'대중교통 산행에서 하산지 막차를 늦게 확인해 생긴 문제와 다음 계획 수정점을 정리합니다.', main:'대중교통 산행 막차 후기', related:['하산지 막차','버스 배차','택시 대체'], angle:'갈 때보다 돌아오는 길을 먼저 봐야 한다는 복기', reader:'차 없이 산행하는 독자', points:['막차 캡처','하산 시간 제한','택시 대체안'], source:{label:'두루누비',url:'https://www.durunubi.kr'}, links:['/blog/p11','/blog/p1'], cta:'대중교통 산행 전에는 하산지 막차 화면을 꼭 저장하세요.' },
  { cat:'후기', pal:'story', title:'무릎이 아팠던 내리막 이후 — 산보다 보폭을 바꿨다', excerpt:'내리막 무릎 통증을 겪은 뒤 코스 선택과 하산 보행, 스틱 사용을 바꾼 경험을 정리합니다.', main:'내리막 무릎 통증 후기', related:['보폭 줄이기','스틱 사용','코스 조정'], angle:'더 강한 체력보다 내려오는 습관을 바꾼 사례', reader:'하산 통증이 반복되는 독자', points:['보폭 축소','스틱 연습','급경사 회피'], source:{label:'국립공원공단',url:'https://www.knps.or.kr'}, links:['/blog/p13','/blog/p17'], cta:'무릎이 아팠던 산행은 실패가 아니라 다음 코스의 기준표입니다.' },
  { cat:'후기', pal:'story', title:'정상 포기 후 더 좋았던 날 — 중도 하산이 남긴 의외의 만족', excerpt:'정상에 오르지 못했지만 안전하게 내려오며 산행 만족을 다시 정의한 경험담입니다.', main:'중도 하산 후기', related:['정상 포기','안전한 하산','초보 산행'], angle:'포기를 실패가 아니라 좋은 판단으로 받아들이는 경험', reader:'정상을 못 가면 아쉬운 독자', points:['포기 기준','대체 조망지','하산 성공'], source:{label:'국립공원공단',url:'https://www.knps.or.kr'}, links:['/blog/p2','/guide/beginner-100'], cta:'다음 산행에서는 정상 말고도 성공 기준을 하나 더 정해보세요.' },
  { cat:'후기', pal:'story', title:'등산 기록을 30번 남기고 달라진 것 — 내 체력의 숫자가 보였다', excerpt:'산행 시간을 꾸준히 기록하면서 코스 선택과 배낭 무게, 휴식 습관이 어떻게 바뀌었는지 정리합니다.', main:'등산 기록 후기', related:['산행 로그','체력 변화','휴식 습관'], angle:'기록이 산행 실력을 객관화한다는 경험', reader:'꾸준히 산을 다니고 싶은 독자', points:['구간 시간','피로 점수','장비 수정'], source:{label:'산림청',url:'https://www.forest.go.kr'}, links:['/tracker','/blog/p357'], cta:'오늘 산행부터 3줄 기록만 남겨도 다음 선택이 쉬워집니다.' },
  { cat:'후기', pal:'story', title:'새 등산화를 신고 바로 긴 산에 간 날 — 물집이 알려준 적응 기간', excerpt:'새 등산화를 길들이지 않고 긴 산행에 나섰다가 물집으로 고생한 경험과 예방책입니다.', main:'새 등산화 물집 후기', related:['등산화 길들이기','양말 선택','발 관리'], angle:'새 장비는 산보다 동네에서 먼저 시험해야 한다는 복기', reader:'새 등산화를 산 직후 산행하려는 독자', points:['짧은 시착 산행','양말 조합','핫스팟 확인'], source:{label:'국립공원공단',url:'https://www.knps.or.kr'}, links:['/blog/p17','/guide/gear-basics'], cta:'새 등산화는 긴 산보다 가까운 둘레길에서 먼저 길들이세요.' },
]

export const GENERATED_POSTS_100: Post[] = topics.map((topic, index) => ({
  id: `p${414 + index}`,
  cat: topic.cat,
  pal: topic.pal,
  title: seoTitle(topic, index),
  excerpt: seoExcerpt(topic),
  body: immediateBody(topic, index) ?? body(topic, index),
  publishAt: publishAt(index),
  read: 8 + (index % 5),
  date: dateLabel(index),
  featured: false,
  badges: [topic.main, ...topic.related.slice(0, 2)],
}))
