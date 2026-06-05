/**
 * 블로그 본문 HTML에서 산 이름 첫 등장을 /mountains 링크로 치환
 * - 이미 <a> 태그 안에 있는 경우 중복 링크 방지
 * - 같은 산 이름은 글 전체에서 첫 번째만 링크
 */

// 100대 명산 이름 정적 목록 (DB 쿼리 대신 빌드 타임 상수)
export const TOP100_NAMES = [
  '가리산','가야산','가지산','감악산','강천산','계룡산','계방산','공작산',
  '관악산','광덕산','구병산','금수산','금오산','금정산','기백산','남덕유산',
  '남산','내연산','내장산','대둔산','대야산','덕숭산','덕유산','도락산',
  '도봉산','두륜산','두타산','마니산','마이산','명성산','명지산','모악산',
  '무등산','무학산','민주지산','방태산','백덕산','백운산','변산','북한산',
  '불암산','비슬산','사량도지리산','소백산','속리산','수락산','신불산',
  '연화산','오대산','오봉산','용문산','용화산','운달산','운문산','운장산',
  '월악산','월출산','유명산','응봉산','장안산','재약산','적상산','주왕산',
  '주흘산','지리산','천관산','천마산','천성산','천왕산','청량산','청화산',
  '축령산','치악산','칠갑산','태백산','팔공산','팔봉산','팔영산','학가산',
  '한라산','함백산','향로봉','화악산','화왕산','황매산','황석산','황악산',
  '황장산','회문산','갑장산','오서산','장성축령산','설악산',
]

export function linkMountainNames(html: string): string {
  if (!html) return html

  const linked = new Set<string>()

  // <a> 태그 내부는 건드리지 않기 위해 split 접근
  // HTML을 <a...>...</a> 구간과 나머지로 분리
  const parts = html.split(/(<a[\s\S]*?<\/a>)/gi)

  return parts.map((part, i) => {
    // 짝수 인덱스 = a 태그 밖, 홀수 = a 태그 안
    if (i % 2 === 1) return part  // a 태그 내부 → 그대로

    // a 태그 바깥 텍스트: 산 이름 첫 등장 → 링크
    let result = part
    for (const name of TOP100_NAMES) {
      if (linked.has(name)) continue
      // 태그 속성값 안의 단어는 치환 안 되도록 태그 밖 텍스트만 처리
      // 단순 문자열 치환 (첫 등장만)
      const idx = result.indexOf(name)
      if (idx === -1) continue

      // 앞뒤 문자 확인: 한글 이름 일부가 아닌지 체크
      const before = result[idx - 1]
      const after  = result[idx + name.length]
      // 태그 < 바로 다음에 있으면 속성값일 수 있음 → 건너뜀
      const prevTag = result.lastIndexOf('<', idx)
      const prevClose = result.lastIndexOf('>', idx)
      if (prevTag > prevClose) continue  // 태그 안

      result =
        result.slice(0, idx) +
        `<a href="/mountains/${encodeURIComponent(name)}" class="mountain-link">${name}</a>` +
        result.slice(idx + name.length)
      linked.add(name)
    }
    return result
  }).join('')
}
