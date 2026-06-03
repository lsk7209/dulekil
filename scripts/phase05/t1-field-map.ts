/**
 * T1 — 필드맵 (Field Map)
 * mountain.zip 내부 구조를 탐색해 실제 컬럼명과 데이터 형식을 확정한다.
 * 결과: scripts/phase05/FIELD_MAP.json
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import AdmZip from 'adm-zip'

const ROOT = path.resolve(__dirname, '../..')
const MOUNTAIN_ZIP = path.join(ROOT, 'docs', 'mountain.zip')
const OUTPUT_DIR = path.join(ROOT, 'scripts', 'phase05')
const FIELD_MAP_PATH = path.join(OUTPUT_DIR, 'FIELD_MAP.json')
const EXTRACT_TMP = path.join(OUTPUT_DIR, '_tmp_extract')

function log(msg: string) {
  console.log(`[T1] ${msg}`)
}

async function main() {
  log('mountain.zip 열기...')

  if (!fs.existsSync(MOUNTAIN_ZIP)) {
    throw new Error(`mountain.zip not found: ${MOUNTAIN_ZIP}`)
  }

  // 외피 zip 열기
  const outerZip = new AdmZip(MOUNTAIN_ZIP)
  const outerEntries = outerZip.getEntries()
  log(`외피 엔트리 수: ${outerEntries.length}`)

  // 엔트리 종류 파악
  const baseZips: string[] = []
  const geojsonZips: string[] = []
  const gpxZips: string[] = []

  for (const e of outerEntries) {
    const n = e.entryName
    if (n.endsWith('_gpx.zip')) gpxZips.push(n)
    else if (n.endsWith('_geojson.zip')) geojsonZips.push(n)
    else if (n.endsWith('.zip')) baseZips.push(n)
  }

  log(`기본 zip: ${baseZips.length}, GeoJSON zip: ${geojsonZips.length}, GPX zip: ${gpxZips.length}`)
  log(`샘플 기본 zip: ${baseZips.slice(0, 3).join(', ')}`)

  // 첫 번째 기본 zip 내부 탐색
  const firstBase = baseZips[0]
  log(`\n── 탐색 대상: ${firstBase}`)

  const innerBuf = outerZip.readFile(firstBase)
  if (!innerBuf) throw new Error('inner zip 읽기 실패')

  const innerZip = new AdmZip(innerBuf)
  const innerEntries = innerZip.getEntries()
  log(`내부 파일 수: ${innerEntries.length}`)
  for (const e of innerEntries) {
    log(`  └ ${e.entryName} (${e.header.size} bytes)`)
  }

  // 내부 파일 내용 읽기 (CSV/JSON/XML)
  const fieldMap: Record<string, unknown> = {
    outer_zip: MOUNTAIN_ZIP,
    stats: {
      total_entries: outerEntries.length,
      base_zips: baseZips.length,
      geojson_zips: geojsonZips.length,
      gpx_zips: gpxZips.length,
    },
    sample_base_zip: firstBase,
    inner_files: [] as string[],
    detected_format: 'unknown',
    columns: [] as string[],
    sample_rows: [] as unknown[],
  }

  for (const e of innerEntries) {
    (fieldMap.inner_files as string[]).push(e.entryName)

    const rawBuf = innerZip.readFile(e)
    if (!rawBuf) continue

    const ext = path.extname(e.entryName).toLowerCase()

    if (ext === '.csv') {
      fieldMap.detected_format = 'csv'
      // EUC-KR 디코딩 시도
      let text: string
      try {
        const iconv = await import('iconv-lite')
        text = iconv.decode(rawBuf, 'euc-kr')
      } catch {
        text = rawBuf.toString('utf-8')
      }

      const lines = text.split(/\r?\n/).filter(Boolean)
      log(`CSV 라인 수: ${lines.length}`)
      log(`헤더: ${lines[0]}`)

      const cols = lines[0].split(',').map(c => c.trim().replace(/^"|"$/g, ''))
      fieldMap.columns = cols
      fieldMap.sample_rows = lines.slice(1, 6).map(l =>
        l.split(',').map(c => c.trim().replace(/^"|"$/g, ''))
      )
      log(`컬럼 (${cols.length}개): ${cols.join(' | ')}`)

    } else if (ext === '.json') {
      fieldMap.detected_format = 'json'
      try {
        const json = JSON.parse(rawBuf.toString('utf-8'))
        const sample = Array.isArray(json) ? json[0] : json
        fieldMap.columns = Object.keys(sample || {})
        fieldMap.sample_rows = Array.isArray(json) ? json.slice(0, 3) : [json]
        log(`JSON 키: ${fieldMap.columns.join(' | ')}`)
      } catch {
        log('JSON 파싱 실패 — UTF-8이 아닐 수 있음')
      }

    } else if (ext === '.xml' || ext === '.gml') {
      fieldMap.detected_format = ext.slice(1)
      const preview = rawBuf.toString('utf-8').slice(0, 1000)
      fieldMap.sample_rows = [preview]
      log(`XML/GML 미리보기:\n${preview}`)

    } else if (ext === '.gpx') {
      fieldMap.detected_format = 'gpx'
      const preview = rawBuf.toString('utf-8').slice(0, 500)
      fieldMap.sample_rows = [preview]
      log(`GPX 미리보기:\n${preview}`)

    } else if (ext === '.dbf') {
      fieldMap.detected_format = 'shapefile'
      log('DBF (Shapefile) 감지 — Shapefile 파서 필요')

    } else {
      const preview = rawBuf.toString('utf-8').slice(0, 200)
      log(`기타 형식 (${ext}): ${preview}`)
    }
  }

  // GPX 샘플도 탐색
  if (gpxZips.length > 0) {
    log(`\n── GPX zip 샘플: ${gpxZips[0]}`)
    const gpxBuf = outerZip.readFile(gpxZips[0])
    if (gpxBuf) {
      const gpxInner = new AdmZip(gpxBuf)
      const gpxEntries = gpxInner.getEntries()
      for (const e of gpxEntries) {
        log(`  GPX 내부: ${e.entryName} (${e.header.size} bytes)`)
        const content = gpxInner.readFile(e)?.toString('utf-8').slice(0, 300)
        if (content) log(`  미리보기: ${content}`)
      }
      fieldMap.gpx_sample = gpxZips[0]
    }
  }

  // GeoJSON 샘플
  if (geojsonZips.length > 0) {
    log(`\n── GeoJSON zip 샘플: ${geojsonZips[0]}`)
    const gjBuf = outerZip.readFile(geojsonZips[0])
    if (gjBuf) {
      const gjInner = new AdmZip(gjBuf)
      for (const e of gjInner.getEntries()) {
        log(`  GeoJSON 내부: ${e.entryName}`)
        const content = gjInner.readFile(e)?.toString('utf-8').slice(0, 400)
        if (content) log(`  미리보기: ${content}`)
        break
      }
    }
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  fs.writeFileSync(FIELD_MAP_PATH, JSON.stringify(fieldMap, null, 2), 'utf-8')
  log(`\n✅ FIELD_MAP.json 저장: ${FIELD_MAP_PATH}`)
}

main().catch(e => { console.error('[T1] 오류:', e); process.exit(1) })
