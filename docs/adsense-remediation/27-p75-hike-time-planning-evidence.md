# p75 hike-time planning correction evidence — 2026-09-13

## Publication boundary

- Effective identity remains `p75`, `산행 계획 거리 고도 소요시간 계산법`, category `가이드`, palette `valley`, badges `계획수립|시간계산`, and `/blog/산행-계획-거리-고도-소요시간-계산법-p75`.
- The post remains public and human-unreviewed. It is a planning framework, not a predicted completion time or safe-completion guarantee.

## Removed high-risk claims

- Universal portal and mountain walking speeds, the unsupported 62% dark-descent rescue statistic, and a fixed distance/elevation formula presented as a standard answer.
- Fixed pack/fitness percentage adjustments, descent-as-a-percentage-of-ascent, claimed 10–20 minute agreement with official times, and a universal first-visit 30% margin.
- A universal 1.5–2 hour pre-sunset completion rule and minute-precise itinerary derived from it.
- The 10 m/s wind threshold, 20–30% time multiplier and twofold exertion claim.

## Replacement contract

- Start with current managing-agency route, closure, operating and entry information plus KMA weather and actual local sunset.
- Separate ascent, rest, descent, access and transport; use official course information and comparable personal records to construct baseline and conservative ranges.
- Treat Naismith-style experience equations only as transparent comparison models with assumptions and uncertainty, never proof of a completion time.
- Define route-specific turnaround points and cancellation conditions; severe weather, visibility, surface or party-state problems trigger cancellation/return rather than a larger time multiplier.
- Recognize cold-stress symptoms by condition and function rather than a temperature formula, stop the summit calculation and seek 119 help when indicated.

## Official sources

- Korea National Park Service route and closure information: https://www.knps.or.kr/
- Korea National Park reservation, entry-time and closure information: https://res.knps.or.kr/
- Korea Meteorological Administration weather and sunrise/sunset information: https://www.weather.go.kr/
- KMA hazardous-weather guidance: https://www.weather.go.kr/w/hazard/safety-guide/heavy-rain.do
- Korean National Fire Agency 119 reporting guide: https://www.nfa.go.kr/nfa/safetyinfo/emergencyservice/119emergencydeclaration
- US CDC cold-weather prevention guidance: https://www.cdc.gov/winter-weather/prevention/index.html

## Fresh verification

- Independent Luna(max) read-only review confirmed the formula/removal matrix and the official-source replacement boundary.
- `PUBLICATION_SAFETY_OK`; p75 no longer needs render redaction, reducing the fixed-rule containment set from eight posts to seven.
- `CONTENT_SAFETY_RENDER_OK affected_posts=7`; TypeScript `--noEmit`; audit 1,276 URLs/344 posts/329 legacy signals/18 findings; 1,305-page build passed.
- Generated p75 HTML contains KNPS/reservation/KMA/NFA/CDC sources, planning ranges, actual-sunset and review-pending language, with no legacy formula or redaction marker.
