import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createClient } from '@libsql/client'

async function main() {
  const client = createClient({ url: 'file::memory:' })
  await client.batch([
    'CREATE TABLE pages (id INTEGER PRIMARY KEY, status TEXT NOT NULL, gate_passed INTEGER NOT NULL)',
    "INSERT INTO pages (id, status, gate_passed) VALUES (1, 'quality_passed', 1)",
  ])

  const claim = () => client.execute({
    sql: "UPDATE pages SET status = 'published' WHERE id = ? AND status = 'quality_passed' AND gate_passed = 1 RETURNING id",
    args: [1],
  })
  const attempts = await Promise.all([claim(), claim()])
  assert.equal(attempts.reduce((sum, result) => sum + result.rows.length, 0), 1)

  const [api, cli, workflow, vercel] = await Promise.all([
    readFile('app/api/cron/publish/route.ts', 'utf8'),
    readFile('scripts/publish/drip-feed.ts', 'utf8'),
    readFile('.github/workflows/quality-gate.yml', 'utf8'),
    readFile('vercel.json', 'utf8'),
  ])
  for (const source of [api, cli]) {
    assert.match(source, /transaction\(async tx/)
    assert.match(source, /eq\([^\n]+status, 'quality_passed'\)/)
    assert.match(source, /returning\(\{ id:/)
    assert.match(source, /tx\.insert\([^\n]*publishLog/)
  }
  assert.doesNotMatch(workflow, /^\s*schedule:/m)
  assert.match(vercel, /"path": "\/api\/cron\/publish"/)

  client.close()
  console.log('PUBLICATION_CLAIM_OK')
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
