# p88 119 call and location correction evidence — 2026-09-13

## Publication boundary

- Effective public identity remains `p88`, `119 구조 신고 — 산에서 위치 정확히 알리는 법`, category `안전`, palette `autumn`, badges `119구조|위치신고`, and `/blog/119-구조-신고-산에서-위치-정확히-알리는-법-p88`.
- This is an automated official-guidance correction, not dispatcher or rescue-team instruction, verified response-time data, or human editorial approval.

## Removed high-risk claims

- “Move before calling” and moving an injured person to a flat rock or trail center.
- Unsupported average response time and location-delay multipliers.
- Guaranteed national-grid/GPS accuracy ranges.
- Treating text reporting as identical to voice, a fixed whistle rule/range, a current named reporting app, device-specific SOS button counts, and prescriptive helicopter positioning.

## Replacement contract

- Avoid only an immediate continuing hazard, then call 119 as soon as possible.
- Do not move a possible head/neck/back injury or otherwise seriously injured person unless remaining presents greater danger; monitor breathing/consciousness and follow dispatcher instructions.
- Share multiple location clues: mountain/trail, national point number or sign, GPS when available, last confirmed location/direction, people and condition; acknowledge coordinate error.
- Keep the call and callback path open, update any unavoidable movement, and do not move toward a guessed pickup/landing point.
- Device/app/text/video features are optional and current-device dependent; never delay the first call to configure them.
- Preserve battery for reporting and callback without blindly enabling airplane mode or powering off.

## Official sources

- 소방청 119 구급신고 요령: https://www.nfa.go.kr/nfa/safetyinfo/emergencyservice/119emergencydeclaration
- 119 안전신고센터: https://www.119.go.kr/
- 행정안전부 긴급신고 통합서비스: https://mois.go.kr/frt/sub/a06/b10/emergencycall/screen.do
- 국립공원공단: https://www.knps.or.kr/
- MedlinePlus spinal injury first aid: https://medlineplus.gov/ency/article/000028.htm

## Fresh verification

- Independent Luna(max) read-only review confirmed the remove/replace matrix and current official links.
- First regression run correctly failed because the rewrite repeated the old “trail center” destination in negative prose; the literal was removed without weakening the rule.
- The following run exposed p72's separate legacy claim that a named 119 app guarantees GPS/photo reporting; p72 remains source-preserved but is newly render-contained.
- `PUBLICATION_SAFETY_OK`; formula/app render containment set is now p72/p84/p335/p407. `CONTENT_SAFETY_RENDER_OK affected_posts=7`.
- TypeScript `--noEmit`; audit 1,276 URLs/344 posts/329 legacy signals/18 findings; 1,305-page build passed.
- Generated p88 HTML contains NFA, 119 Center, MOIS, KNPS and MedlinePlus links, early-call/no-move/location-update/review-pending language, with no legacy guarantee or redaction marker.
- Scoped `git diff --check` passed with only existing LF-to-CRLF warnings.
