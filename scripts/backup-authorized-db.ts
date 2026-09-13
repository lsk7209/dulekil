import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { createClient, type InValue } from '@libsql/client'

function valueAfter(flag: string) {
  const index = process.argv.indexOf(flag)
  return index >= 0 ? process.argv[index + 1] : undefined
}

function quoteIdentifier(value: string) {
  return `"${value.replaceAll('"', '""')}"`
}

async function main() {
  const credentialFile = valueAfter('--credentials')
  const outputFile = valueAfter('--out')
  if (!credentialFile || !outputFile) throw new Error('Usage: pnpm backup:authorized-db -- --credentials <absolute-private-file> --out <absolute-private.db>')
  const credentialsPath = path.resolve(credentialFile)
  const databasePath = path.resolve(outputFile)
  if (!path.isAbsolute(credentialFile) || !fs.existsSync(credentialsPath)) throw new Error('Credential file must be an existing absolute path')
  if (!path.isAbsolute(outputFile)) throw new Error('Backup output must be an absolute path')
  const repoRoot = path.resolve(process.cwd()) + path.sep
  if (databasePath.startsWith(repoRoot)) throw new Error('Backup output must be outside the repository')
  if (fs.existsSync(databasePath)) throw new Error('Refusing to overwrite an existing backup')
  fs.mkdirSync(path.dirname(databasePath), { recursive: true })

  const lines = fs.readFileSync(credentialsPath, 'utf8').split(/\r?\n/).map(line => line.trim()).filter(Boolean)
  const authToken = lines.find(line => line.startsWith('eyJ'))
  const url = lines.find(line => /^(?:libsql|https):\/\//i.test(line))
  if (!authToken || !url) throw new Error('Credential file must contain one libSQL URL and one token line')

  const remote = createClient({ url, authToken })
  const local = createClient({ url: `file:${databasePath.replaceAll('\\', '/')}` })
  const remoteTx = await remote.transaction('read')
  const counts: Record<string, number> = {}
  try {
    await local.execute('PRAGMA foreign_keys=OFF')
    const schemaResult = await remoteTx.execute("SELECT type, name, tbl_name, sql FROM sqlite_schema WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%' ORDER BY CASE type WHEN 'table' THEN 0 WHEN 'index' THEN 1 WHEN 'trigger' THEN 2 ELSE 3 END, name")
    const schema = schemaResult.rows.map(row => ({ type: String(row.type), name: String(row.name), sql: String(row.sql) }))
    const tables = schema.filter(item => item.type === 'table')

    for (const table of tables) await local.execute(table.sql)
    const localTx = await local.transaction('write')
    try {
      for (const table of tables) {
        const rows = await remoteTx.execute(`SELECT * FROM ${quoteIdentifier(table.name)}`)
        counts[table.name] = rows.rows.length
        if (rows.columns.length === 0) continue
        const columns = rows.columns.map(quoteIdentifier).join(', ')
        const placeholders = rows.columns.map(() => '?').join(', ')
        for (const row of rows.rows) {
          const args = rows.columns.map(column => row[column] as InValue)
          await localTx.execute({ sql: `INSERT INTO ${quoteIdentifier(table.name)} (${columns}) VALUES (${placeholders})`, args })
        }
      }
      await localTx.commit()
    } catch (error) {
      await localTx.rollback()
      throw error
    }
    for (const item of schema.filter(item => item.type !== 'table')) await local.execute(item.sql)
    await local.execute('PRAGMA foreign_keys=ON')
    await remoteTx.commit()

    const integrity = await local.execute('PRAGMA integrity_check')
    if (String(integrity.rows[0]?.integrity_check) !== 'ok') throw new Error('Local backup integrity_check failed')
    const foreignKeys = await local.execute('PRAGMA foreign_key_check')
    if (foreignKeys.rows.length > 0) throw new Error(`Local backup foreign_key_check failed (${foreignKeys.rows.length} rows)`)
    for (const [table, expected] of Object.entries(counts)) {
      const result = await local.execute(`SELECT COUNT(*) AS count FROM ${quoteIdentifier(table)}`)
      if (Number(result.rows[0]?.count) !== expected) throw new Error(`Row-count mismatch for ${table}`)
    }
  } catch (error) {
    await remoteTx.rollback()
    throw error
  } finally {
    local.close()
    remote.close()
  }

  const sha256 = crypto.createHash('sha256').update(fs.readFileSync(databasePath)).digest('hex')
  const manifest = { createdAt: new Date().toISOString(), source: 'authorized-libsql-read-transaction', databasePath, bytes: fs.statSync(databasePath).size, sha256, counts }
  fs.writeFileSync(`${databasePath}.manifest.json`, JSON.stringify(manifest, null, 2))
  console.log(JSON.stringify({ created: true, databasePath, bytes: manifest.bytes, sha256, counts, integrity: 'ok' }, null, 2))
}

main().catch(error => {
  const outputFile = valueAfter('--out')
  if (outputFile && path.isAbsolute(outputFile)) {
    const resolved = path.resolve(outputFile)
    const repoRoot = path.resolve(process.cwd()) + path.sep
    if (!resolved.startsWith(repoRoot)) {
      for (const candidate of [resolved, `${resolved}-wal`, `${resolved}-shm`, `${resolved}.manifest.json`]) {
        try { fs.rmSync(candidate, { force: true, maxRetries: 5, retryDelay: 200 }) } catch { /* preserve original error */ }
      }
    }
  }
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
