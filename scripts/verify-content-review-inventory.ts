import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

function parseCsvLine(line: string): string[] {
  const values: string[] = []
  let value = ''
  let quoted = false
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    if (char === '"' && quoted && line[i + 1] === '"') {
      value += '"'
      i += 1
    } else if (char === '"') {
      quoted = !quoted
    } else if (char === ',' && !quoted) {
      values.push(value)
      value = ''
    } else {
      value += char
    }
  }
  values.push(value)
  return values
}

async function main() {
  const csv = await readFile('reports/adsense-remediation/content-inventory.csv', 'utf8')
  const lines = csv.trim().split(/\r?\n/)
  const headers = parseCsvLine(lines[0])
  for (const required of ['proposed_status', 'review_status', 'reviewer_type', 'reviewed_at', 'evidence_url', 'review_notes']) {
    assert.ok(headers.includes(required), `missing review field: ${required}`)
  }

  const rows = lines.slice(1).map(line => Object.fromEntries(headers.map((header, index) => [header, parseCsvLine(line)[index]])))
  assert.equal(rows.length, 344)
  assert.ok(rows.every(row => row.review_status === 'UNREVIEWED'))
  assert.ok(rows.every(row => row.source_verified === 'false'))
  assert.ok(rows.every(row => !row.reviewer_type && !row.reviewed_at && !row.evidence_url))
  assert.ok(rows.every(row => ['REVISE', 'NEEDS_SOURCE'].includes(row.proposed_status)))
  console.log('CONTENT_REVIEW_INVENTORY_OK')
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
