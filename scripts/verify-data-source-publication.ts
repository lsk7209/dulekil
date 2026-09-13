import assert from 'node:assert/strict'
import { canPublishDatabaseDerivedData } from '../lib/data-source-publication'
import type { HubDataState } from '../lib/data-source-state'

const states: HubDataState[] = [
  'database',
  'database-partial',
  'static-no-config',
  'static-empty',
  'static-missing-record',
  'static-unavailable',
]

for (const state of states) {
  assert.equal(canPublishDatabaseDerivedData(state), state === 'database', state)
}

console.log('DATA_SOURCE_PUBLICATION_OK')
