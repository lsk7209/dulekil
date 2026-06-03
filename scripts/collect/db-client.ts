/**
 * 스크립트용 DB 클라이언트 — embedded replica 없이 원격 직접 연결
 * (스크립트는 로컬 캐시보다 원격 최신 상태가 중요)
 */
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from '../../lib/db/schema'
import { config } from 'dotenv'

config({ path: '.env.local' })

if (!process.env.TURSO_DATABASE_URL) throw new Error('TURSO_DATABASE_URL missing')
if (!process.env.TURSO_AUTH_TOKEN)   throw new Error('TURSO_AUTH_TOKEN missing')

const client = createClient({
  url:       process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

export const db = drizzle(client, { schema })
export { schema }
