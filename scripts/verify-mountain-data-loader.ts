import assert from 'node:assert/strict'
import { loadMountainDetailFromReader, type MountainDataReader } from '../lib/mountain-data-loader'

type Mountain = { id: number; name: string }
type Course = { id: number; mountainId: number }
const dbMountain: Mountain = { id: 77, name: 'DB 산' }
const staticMountain: Mountain = { id: 1, name: '기본 산' }
const fallback = (slug: string) => slug === '기본 산' ? staticMountain : null

function reader(overrides: Partial<MountainDataReader<Mountain, Course>> = {}): MountainDataReader<Mountain, Course> {
  return {
    findMountain: async () => dbMountain,
    findCourses: async mountainId => [{ id: 9, mountainId }],
    ...overrides,
  }
}

async function main() {
const success = await loadMountainDetailFromReader(reader(), 'DB 산', fallback)
assert.equal(success.state, 'database')
assert.equal(success.courses[0].mountainId, 77)

const emptyCourses = await loadMountainDetailFromReader(reader({ findCourses: async () => [] }), 'DB 산', fallback)
assert.equal(emptyCourses.state, 'database')
assert.deepEqual(emptyCourses.courses, [])

const courseFailure = await loadMountainDetailFromReader(reader({ findCourses: async () => { throw new Error('course outage') } }), 'DB 산', fallback)
assert.equal(courseFailure.state, 'database-partial')
assert.equal(courseFailure.mountain, dbMountain)
assert.deepEqual(courseFailure.courses, [])

const lookupFailure = await loadMountainDetailFromReader(reader({ findMountain: async () => { throw new Error('mountain outage') } }), '기본 산', fallback)
assert.equal(lookupFailure.state, 'static-unavailable')
assert.equal(lookupFailure.mountain, staticMountain)
assert.deepEqual(lookupFailure.courses, [])

let courseLookupCalled = false
const missing = await loadMountainDetailFromReader(reader({
  findMountain: async () => null,
  findCourses: async () => { courseLookupCalled = true; return [{ id: 1, mountainId: 1 }] },
}), '기본 산', fallback)
assert.equal(missing.state, 'static-missing-record')
assert.equal(missing.mountain, staticMountain)
assert.equal(courseLookupCalled, false)
assert.deepEqual(missing.courses, [])

console.log('MOUNTAIN_DATA_LOADER_OK')
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
