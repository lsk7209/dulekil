import assert from 'node:assert/strict'
import fs from 'node:fs'

const source = fs.readFileSync(new URL('../app/sitemap.ts', import.meta.url), 'utf8')

assert.doesNotMatch(source, /const\s+NOW\s*=\s*new Date\(\)\.toISOString\(\)/, 'sitemap must not use generation time as lastModified')

const blogStart = source.indexOf('const blogPages')
const blogEnd = source.indexOf('\n  const ', blogStart + 1)
const blogBody = source.slice(blogStart, blogEnd)
assert.match(blogBody, /lastModified:\s*getPostModifiedDate\(p\)/, 'posts must retain their source-derived modified date')

const lastModifiedAssignments = [...source.matchAll(/lastModified\s*:/g)]
assert.equal(lastModifiedAssignments.length, 1, 'only posts with source-derived dates may emit lastModified')

console.log('SITEMAP_LASTMOD_OK')
