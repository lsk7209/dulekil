import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createClient } from '@libsql/client';
const source = readFileSync(new URL('../lib/db/queries.ts', import.meta.url), 'utf8');
const expression = source.match(/min_dist:\s+sql<number \| null>`([^`]+)`/)[1];
const db = createClient({url:'file::memory:'});
try {
  await db.execute('CREATE TABLE courses (distance REAL)');
  await db.execute('INSERT INTO courses VALUES (-1), (3), (NULL)');
  assert.equal((await db.execute(`SELECT ${expression} AS value FROM courses`)).rows[0].value, 3);
  await db.execute('DELETE FROM courses');
  await db.execute('INSERT INTO courses VALUES (-1), (NULL)');
  assert.equal((await db.execute(`SELECT ${expression} AS value FROM courses`)).rows[0].value, null);
  await db.execute('INSERT INTO courses VALUES (0), (0.1)');
  assert.equal((await db.execute(`SELECT ${expression} AS value FROM courses`)).rows[0].value, 0);
  console.log('HUB_DISTANCE_SQL_OK');
} finally { db.close(); }
