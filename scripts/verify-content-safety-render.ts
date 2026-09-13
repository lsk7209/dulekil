import assert from 'node:assert/strict'
import { POSTS } from '../lib/posts'
import { findUnsafeEmergencyContacts, sanitizeUnreviewedArticleHtml } from '../lib/content-safety'

for (const unsafe of [
  '<p>국립공원 긴급연락처 1588-0088로 신고하세요.</p>',
  '<p>국립공원관리공단 <strong>구조대</strong> (1588 3650)에 연락하세요.</p>',
  '<li>산악 재난 대안 연락처 1670-9119 또는 1688-3119</li>',
  '<p>길을 잃으면 119 또는 국립공원 안내전화(1588-3650) 신고입니다.</p>',
  '<p>등산용품점 문의 033-553-XXXX</p>',
]) {
  const result = sanitizeUnreviewedArticleHtml(unsafe)
  assert.equal(result.redactedClaims, 1)
  assert.doesNotMatch(result.html, /1588[- ]?(?:0088|3650)|1670-9119|1688-3119|XXXX/i)
  assert.match(result.html, /119/)
}

for (const allowed of [
  '<p>조난 시 119에 신고하세요.</p>',
  '<p>산불은 119 또는 산림청 산불신고 전화 1588-9119로 신고하세요.</p>',
  '<p>공원 사무소에 문의: 054-873-0014</p>',
]) {
  const result = sanitizeUnreviewedArticleHtml(allowed)
  assert.equal(result.redactedClaims, 0)
  assert.equal(result.html, allowed)
}

let affectedPosts = 0
for (const post of POSTS) {
  const source = post.body ?? ''
  const result = sanitizeUnreviewedArticleHtml(source)
  if (result.redactedClaims > 0) affectedPosts += 1
  assert.equal(findUnsafeEmergencyContacts(result.html).length, 0, post.id)
  assert.equal(post.body ?? '', source, `${post.id}: source body must remain unchanged`)
}
assert.ok(affectedPosts > 0, 'fixture inventory must exercise render-time redaction')

console.log(`CONTENT_SAFETY_RENDER_OK affected_posts=${affectedPosts}`)
