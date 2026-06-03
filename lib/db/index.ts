/**
 * Turso DB 클라이언트 + Drizzle ORM
 *
 * 비용 최적화:
 * - 개발: embedded replica (로컬 SQLite 캐시 → 읽기 무료, 쓰기만 네트워크)
 * - 프로덕션: 직접 원격 연결 (Vercel은 파일시스템 ephemeral)
 */
import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema'

if (!process.env.TURSO_DATABASE_URL) throw new Error('TURSO_DATABASE_URL missing')
if (!process.env.TURSO_AUTH_TOKEN)   throw new Error('TURSO_AUTH_TOKEN missing')

const isProduction = process.env.NODE_ENV === 'production'

const client = createClient(
  isProduction
    ? {
        // 프로덕션: 원격 직접 연결
        url:       process.env.TURSO_DATABASE_URL,
        authToken: process.env.TURSO_AUTH_TOKEN,
      }
    : {
        // 개발: embedded replica — 읽기는 로컬 캐시, 쓰기만 원격 전송 → 비용 절감
        url:          'file:.turso-local.db',
        syncUrl:      process.env.TURSO_DATABASE_URL,
        authToken:    process.env.TURSO_AUTH_TOKEN,
        syncInterval: 60, // 60초마다 원격 sync
      }
)

export const db = drizzle(client, { schema })

export type DB = typeof db
