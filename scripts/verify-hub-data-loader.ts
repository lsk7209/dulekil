import assert from 'node:assert/strict'
import { loadHubDataFromReader } from '../lib/hub-data-loader'

type Mountain = { id: number; name: string }
type Stat = { mountainId: number; distance: number }
type Item = { id: number; label: string }

const fallback = (): Item[] => [{ id: 99, label: 'fallback' }]
const build = (mountains: Mountain[], stats: Stat[]): Item[] => mountains.map(mountain => ({
  id: mountain.id,
  label: `${mountain.name}:${stats.find(stat => stat.mountainId === mountain.id)?.distance ?? 'none'}`,
}))

async function main() {
  let uncached = 0
  let mountainReads = 0
  let statReads = 0
  const reader = {
    async findMountains() {
      mountainReads += 1
      return [{ id: 1, name: '산' }]
    },
    async findStats(ids: number[]) {
      statReads += 1
      assert.deepEqual(ids, [1])
      return [{ mountainId: 1, distance: 3 }]
    },
  }

  assert.deepEqual(await loadHubDataFromReader({
    configured: false, reader, fallback, build, markUncached: () => { uncached += 1 },
  }), { mountains: fallback(), state: 'static-no-config' })
  assert.equal(mountainReads, 0)
  assert.equal(statReads, 0)
  assert.equal(uncached, 1)

  assert.deepEqual(await loadHubDataFromReader({
    configured: true,
    reader: { findMountains: async () => [], findStats: async () => { throw new Error('must not run') } },
    fallback,
    build,
    markUncached: () => { uncached += 1 },
  }), { mountains: [], state: 'static-empty' })
  assert.equal(uncached, 2)

  assert.deepEqual(await loadHubDataFromReader({
    configured: true,
    reader: { findMountains: async () => { throw new Error('down') }, findStats: async () => [] },
    fallback,
    build,
    markUncached: () => { uncached += 1 },
  }), { mountains: fallback(), state: 'static-unavailable' })

  assert.deepEqual(await loadHubDataFromReader({
    configured: true,
    reader: { findMountains: async () => [{ id: 1, name: '산' }], findStats: async () => { throw new Error('down') } },
    fallback,
    build,
    markUncached: () => { uncached += 1 },
  }), { mountains: fallback(), state: 'static-unavailable' })

  assert.deepEqual(await loadHubDataFromReader({
    configured: true, reader, fallback, build, markUncached: () => { uncached += 1 },
  }), { mountains: [{ id: 1, label: '산:3' }], state: 'database' })
  assert.equal(uncached, 4)
  console.log('HUB_DATA_LOADER_OK')
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
