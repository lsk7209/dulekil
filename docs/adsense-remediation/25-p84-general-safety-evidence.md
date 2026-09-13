# p84 general mountain-safety correction evidence — 2026-09-13

## Publication boundary

- Effective public identity remains `p84`, `산에서 살아남는 안전 수칙 10가지`, category `안전`, palette `sage`, badges `안전수칙|기본`, and `/blog/산에서-살아남는-안전-수칙-10가지-p84`.
- This is an automated official-guidance correction, not a claim that accidents are preventable, route-specific advice, medical instruction, source verification, or human editorial approval.

## Removed high-risk claims

- Unsupported annual accident counts, cause percentages, preventability rates and solo-rescue delay.
- Fixed seasonal sunset clock, fall-risk multiplier and ascent/descent-time formula.
- Universal hourly/total water and food schedule.
- Cardinal cloud-direction prediction, route-loss percentage and categorical backtracking.
- Guaranteed national-grid accuracy, fixed emergency-gear weights/signals and live-location app assumptions.
- Subjective fitness-percentage turnaround and descent-energy formula.

## Replacement contract

- Current official closure/weather checks, route and return-plan sharing, actual sunset/terrain/party-based turnaround.
- Individualized water/food preparation without forced intake; current symptoms and emergency signals before diagnosis.
- Stop-and-assess navigation, multiple location clues, early 119/manager consultation and no guessed shortcut.
- Gear selected for conditions and known use, with no product/quantity guarantee.
- Conservative solo planning and functional/risk-based turnaround rather than percentages.

## Official sources

- 소방청 119 구급신고 요령: https://www.nfa.go.kr/nfa/safetyinfo/emergencyservice/119emergencydeclaration
- 행정안전부 긴급신고 통합서비스: https://mois.go.kr/frt/sub/a06/b10/emergencycall/screen.do
- 기상청 기상위험 행동요령: https://www.weather.go.kr/w/hazard/safety-guide/heavy-rain.do
- 국립공원공단: https://www.knps.or.kr/
- 산림청: https://www.forest.go.kr/
- 질병관리청 온열질환 응급조치: https://www.kdca.go.kr/contents.es?mid=a20205030103
- CDC Yellow Book: https://www.cdc.gov/yellow-book/hcp/environmental-hazards-risks/heat-and-cold-illness-in-travelers.html

## Fresh verification and repair history

- Independent Luna(max) read-only review confirmed the remove/replace matrix and official-source boundaries.
- The first regression run showed the new sunset rule was too broad and matched unrelated transport clock times; it was narrowed to require explicit sunset context.
- The refined rule still found genuine fixed sunset rules in p75/p86/p349/p414/p417/p449. Those source bodies/public states remain unchanged, while their affected rendered blocks are contained pending review. Together with p72 and existing p335/p407, the containment set is nine posts.
- The shared safety guide also contained a fixed `1~2 hours before sunset` rule. It was replaced with actual sunset, route, terrain, party pace, escape and current-danger guidance.
- `PUBLICATION_SAFETY_OK`; `CONTENT_SAFETY_RENDER_OK affected_posts=7`; TypeScript `--noEmit`; audit 1,276 URLs/344 posts/329 legacy signals/18 findings; 1,305-page build passed.
- Generated p84 HTML contains NFA/MOIS/KMA/KNPS/Forest/KDCA/CDC links, early 119, no-forced-intake and functional turnaround guidance, with no legacy formula or redaction marker.
- Scoped `git diff --check` passed with only existing LF-to-CRLF warnings.
