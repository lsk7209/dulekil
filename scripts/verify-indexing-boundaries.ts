import assert from 'node:assert/strict'
import fs from 'node:fs'
import { normalizeIndexNowUrls } from '../lib/indexing-policy'
import robots from '../app/robots'

assert.deepEqual(normalizeIndexNowUrls(['https://dullegilgogo.kr/blog/example', 'https://dullegilgogo.kr/blog/example']), ['https://dullegilgogo.kr/blog/example'])
for (const invalid of [[], ['http://dullegilgogo.kr/x'], ['https://evil.test/x'], ['https://dullegilgogo.kr/x#fragment'], Array.from({ length: 101 }, (_, i) => `https://dullegilgogo.kr/blog/${i}`)]) {
  assert.equal(normalizeIndexNowUrls(invalid), null)
}

const routeSource = fs.readFileSync('app/api/indexnow/route.ts', 'utf8')
assert.match(routeSource, /isAuthorizedCronRequest/)
assert.ok((robots().rules as Array<{ userAgent: string; disallow?: string[] }>).filter(rule => ['*', 'Googlebot', 'Mediapartners-Google', 'Google-Display-Ads-Bot'].includes(rule.userAgent)).every(rule => rule.disallow?.includes('/api/')))
const guideSource = fs.readFileSync('app/guide/[slug]/page.tsx', 'utf8')
assert.doesNotMatch(guideSource, /datePublished:\s*'2025-10-01'|dateModified:\s*'2026-06-01'/)
const llmsSource = fs.readFileSync('app/llms.txt/route.ts', 'utf8')
assert.doesNotMatch(llmsSource, /94개 산|7,787개 코스/)
for (const [file, duplicateTitle] of [
  ['app/privacy/page.tsx', "title: '개인정보처리방침 | 둘레길고고'"],
  ['app/terms/page.tsx', "title: '이용약관 | 둘레길고고'"],
  ['app/data-license/page.tsx', "title: '데이터 출처·라이선스 | 둘레길고고'"],
  ['app/about/page.tsx', "title: '사이트 소개 | 둘레길고고'"],
  ['app/contact/page.tsx', "title: '문의하기 | 둘레길고고'"],
  ['app/blog/page.tsx', "title: '둘레길고고 매거진 · 다음 산을 고르는 안목'"],
] as const) assert.equal(fs.readFileSync(file, 'utf8').split('openGraph:')[0].includes(duplicateTitle), false, file)
assert.match(fs.readFileSync('components/site-header.tsx', 'utf8'), /label: '가이드',\s+href: '\/guide'/)
assert.match(fs.readFileSync('components/site-footer.tsx', 'utf8'), /\['가이드',\s+'\/guide'\]/)
assert.doesNotMatch(fs.readFileSync('app/page.tsx', 'utf8'), /SearchAction|search_term_string/)
assert.doesNotMatch(fs.readFileSync('app/mountains/mountains-client.tsx', 'utf8'), /산림청이 선정한 \{mountains\.length\}개/)
const tagSource = fs.readFileSync('app/tags/[badge]/page.tsx', 'utf8')
assert.match(tagSource, /if \(!hasPublishedPosts\)/)
assert.match(tagSource, /robots: \{ index: false, follow: false \}/)
assert.match(tagSource, /alternates: \{ canonical: null \}/)
console.log('INDEXING_BOUNDARIES_OK')
