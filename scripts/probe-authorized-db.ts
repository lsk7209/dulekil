import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@libsql/client'

function valueAfter(flag: string) {
  const index = process.argv.indexOf(flag)
  return index >= 0 ? process.argv[index + 1] : undefined
}

async function main() {
  const credentialFile = valueAfter('--credentials')
  if (!credentialFile) throw new Error('Usage: pnpm audit:db-probe -- --credentials <absolute-private-file>')
  const resolved = path.resolve(credentialFile)
  if (!path.isAbsolute(credentialFile) || !fs.existsSync(resolved)) throw new Error('Credential file must be an existing absolute path')

  const lines = fs.readFileSync(resolved, 'utf8').split(/\r?\n/).map(line => line.trim()).filter(Boolean)
  const authToken = lines.find(line => line.startsWith('eyJ'))
  const url = lines.find(line => /^(?:libsql|https):\/\//i.test(line))
  if (!authToken || !url) throw new Error('Credential file must contain one libSQL URL and one token line')

  const client = createClient({ url, authToken })
  try {
    const [version, schema] = await Promise.all([
      client.execute('SELECT sqlite_version() AS version'),
      client.execute("SELECT name FROM sqlite_schema WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"),
    ])
    console.log(JSON.stringify({
      connected: true,
      sqliteVersion: String(version.rows[0]?.version ?? ''),
      tableCount: schema.rows.length,
      tables: schema.rows.map(row => String(row.name)),
      mode: 'read-only-metadata-probe',
    }, null, 2))
  } finally {
    client.close()
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
