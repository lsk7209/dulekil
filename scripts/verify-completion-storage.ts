import assert from 'node:assert/strict'
import { COMPLETION_STORAGE_KEY, readCompletionNames, writeCompletionNames } from '../lib/completion-storage'

let value: string | null = '["지리산","지리산",3,"설악산"]'
const storage = { getItem: () => value, setItem: (key: string, next: string) => { assert.equal(key, COMPLETION_STORAGE_KEY); value = next } }
assert.deepEqual([...readCompletionNames(storage)], ['지리산', '설악산'])
assert.equal(writeCompletionNames(storage, new Set(['지리산', '설악산'])), true)
assert.equal(value, '["지리산","설악산"]')

const denied = { getItem: () => { throw new Error('denied') }, setItem: () => { throw new Error('quota') } }
assert.deepEqual([...readCompletionNames(denied)], [])
assert.equal(writeCompletionNames(denied, new Set(['지리산'])), false)
assert.equal(COMPLETION_STORAGE_KEY, 'dulle_done_v1')
console.log('COMPLETION_STORAGE_OK')
