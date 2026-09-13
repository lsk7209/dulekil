import assert from 'node:assert/strict'
import fs from 'node:fs'
import { isMonetizablePath } from '../lib/monetization-policy'

for (const path of ['/', '/blog', '/blog/example', '/guide/safety-checklist', '/mountains/지리산', '/list/gangwon', '/tags/대중교통']) {
  assert.equal(isMonetizablePath(path), true, path)
}
for (const path of ['/privacy', '/terms', '/contact', '/about', '/data-license', '/tracker', '/missing', '/api/cron/publish']) {
  assert.equal(isMonetizablePath(path), false, path)
}

const layout = fs.readFileSync('app/layout.tsx', 'utf8')
assert.doesNotMatch(layout, /<script[\s\S]*adsbygoogle\.js/)
assert.match(layout, /NEXT_PUBLIC_GOOGLE_CMP_READY === 'true'/)
assert.match(layout, /<MonetizationLayer adsenseClientId=\{ADSENSE_ID\} googleCmpReady=\{GOOGLE_CMP_READY\}/)
assert.match(layout, /GOOGLE_CMP_READY && GA_ID/)
assert.doesNotMatch(layout, /NEXT_PUBLIC_ADSENSE_CLIENT_ID \|\|/)
const layer = fs.readFileSync('components/monetization-layer.tsx', 'utf8')
assert.match(layer, /meta\[name="robots"\]/)
assert.match(layer, /includes\('noindex'\)/)
assert.match(layer, /googleCmpReady && adsenseClientId/)
const privacy = fs.readFileSync('app/privacy/page.tsx', 'utf8')
assert.match(privacy, /쿠팡 파트너스 배너 제공·측정 시스템/)
assert.match(privacy, /현재 페이지 경로/)
console.log('MONETIZATION_POLICY_OK')
