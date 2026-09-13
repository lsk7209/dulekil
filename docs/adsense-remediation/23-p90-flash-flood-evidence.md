# p90 flash-flood and valley evacuation correction evidence — 2026-09-13

## Publication boundary

- Effective public ID, title, category, badges and slug remain unchanged: `p90`, `폭우 속 산행 — 계곡 위험과 대피 수칙`, `안전`, `폭우대피|계곡위험`, `/blog/폭우-속-산행-계곡-위험과-대피-수칙-p90`.
- This is an automated primary-guidance correction, not a route-specific flood forecast, rescue instruction override, source verification, or human editorial approval.

## Removed high-risk claims

- Unsupported rainfall-to-rise, water-depth, velocity and onset-time formulas.
- Universal rainfall/probability/previous-day cancellation thresholds.
- Fixed vertical evacuation distance and five-minute channel monitoring.
- The post-rain two-to-three-hour crossing timer.
- Categorical ridge/rock-overhang safety and universal campsite rescue-system claims.
- Unsupported accident counts and implied safe crossing after visible recession.

## Replacement contract

- Use current KMA warnings/radar plus KNPS/local closure notices; uncertainty or official warning means postpone/cancel.
- Leave the channel and low crossing immediately when water rises, muddies, carries debris or makes unusual noise; people before equipment.
- Do not enter or cross moving/rising/muddy water based on depth, speed, appearance or elapsed time.
- Move to a designated stable high place while avoiding unstable slopes, flooded bridges and lightning-exposed ridges.
- Call 119 immediately for isolation, injury, missing persons, rising water, blocked escape or uncertain evacuation; share GPS/landmark, people and conditions.
- Return only after official reopening and route/crossing confirmation.

## Official sources

- 기상청 호우 행동요령: https://www.weather.go.kr/w/hazard/safety-guide/heavy-rain.do
- 행정안전부 국민안전24: https://www.safekorea.go.kr/
- 소방청·119: https://www.nfa.go.kr/nfa/
- 국립공원공단 탐방로 통제: https://www.knps.or.kr/

## Fresh verification

- Independent Luna(max) read-only review confirmed the remove/replace matrix against current Korean primary guidance. Local source inspection corrected the reviewer's palette note: effective p90 palette remains the repository's `sage` value; the rewrite does not alter it.
- `PUBLICATION_SAFETY_OK` and `CONTENT_SAFETY_RENDER_OK affected_posts=7`.
- TypeScript `--noEmit`; audit 1,276 URLs/344 posts/329 legacy signals/18 findings; 1,305-page production build passed.
- Generated p90 HTML contains KMA, SafeKorea, NFA and KNPS links, immediate 119, no-timed-return and ridge-risk language. No legacy threshold or redaction marker is present.
- Scoped `git diff --check` passed with only existing LF-to-CRLF warnings.
