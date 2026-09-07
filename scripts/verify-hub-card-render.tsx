import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MountainsClient } from '../app/mountains/mountains-client'
import { HomeClient } from '../app/home-client'
import type { HubMountain } from '../lib/db/queries'

Object.assign(globalThis, { React })
const mountain: HubMountain = {
  id: 1, name: '테스트산', peak: '테스트산', region: '강원', sigun: '', group: '강원', elev: 1000,
  dist: null, time: '자료 없음', routeMetricSource: 'database', diff: '중', gpx: false,
  transit: false, transitNote: '', beginner: true, sun: false, pal: 'forest', slug: '테스트산',
  description: null, seasons: ['가을'], tags: [], pop: 1000,
}
for (const Component of [MountainsClient, HomeClient]) {
  const render = (row: HubMountain) => renderToStaticMarkup(React.createElement(Component, {mountains:[row], latestPosts:[], postCount:0}))
  const missing = render(mountain)
  assert.ok(missing.includes('자료 없음'))
  assert.ok(missing.includes('등록 최단 거리'))
  assert.ok(missing.includes('상행 최대 시간'))
  assert.ok(missing.includes('서로 다른 등록 구간'))
  assert.equal(missing.includes('?:??'), false)
  assert.equal(missing.includes('nullkm'), false)
  const reference = render({...mountain, routeMetricSource:'static', dist:3, time:'1:00'})
  assert.ok(reference.includes('참고 거리'))
  assert.ok(reference.includes('참고 시간'))
  assert.equal(reference.includes('서로 다른 등록 구간'), false)
}
console.log('HUB_CARD_RENDER_OK')
