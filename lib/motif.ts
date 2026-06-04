// Module-level memoisation cache
const _cache = new Map<string, string>()
function _cached(key: string, fn: () => string): string {
  if (_cache.has(key)) return _cache.get(key)!
  if (_cache.size > 200) { const k = _cache.keys().next().value; if (k !== undefined) _cache.delete(k) }
  const v = fn()
  _cache.set(key, v)
  return v
}

// Seeded PRNG — same seed always produces the same ridgeline/contour
function seeded(seed: string) {
  let s = 0
  for (let i = 0; i < seed.length; i++) s = ((s * 31 + seed.charCodeAt(i)) >>> 0)
  return () => { s = ((s * 1664525 + 1013904223) >>> 0); return s / 4294967296 }
}

export const PALETTES: Record<string, [string, string, string]> = {
  forest:  ['#3A5848', '#2F4A3C', '#22382C'],
  dawn:    ['#5B6B63', '#3E5147', '#2A3A30'],
  winter:  ['#9FB2AE', '#7D938C', '#5C746C'],
  autumn:  ['#A8693A', '#8A5430', '#5E3A22'],
  valley:  ['#4E7C6A', '#356553', '#234A3C'],
  sage:    ['#9DB3A2', '#7E9886', '#5E7E63'],
}

function ridgePath(rng: () => number, w: number, h: number, baseY: number, amp: number, rough: number): string {
  const pts: [number, number][] = []
  for (let i = 0; i <= rough; i++) {
    const x = (w / rough) * i
    const y = baseY - (Math.sin(i * 1.3 + rng() * 6) * 0.5 + rng()) * amp
    pts.push([x, y])
  }
  let d = `M0,${h} L0,${pts[0][1].toFixed(1)}`
  for (let j = 1; j < pts.length; j++) {
    const mx = (pts[j - 1][0] + pts[j][0]) / 2
    const my = (pts[j - 1][1] + pts[j][1]) / 2
    d += ` Q${pts[j - 1][0].toFixed(1)},${pts[j - 1][1].toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}`
  }
  d += ` L${w},${pts[pts.length - 1][1].toFixed(1)} L${w},${h} Z`
  return d
}

export interface RidgeCoverOpts {
  seed?: string
  palette?: string
  sun?: string | null
  w?: number
  h?: number
  sky?: string
}

export function ridgeCover(opts: RidgeCoverOpts = {}): string {
  return _cached(JSON.stringify(opts), () => {
    const w = opts.w ?? 400
    const h = opts.h ?? 220
    const pal = PALETTES[opts.palette ?? 'forest'] ?? PALETTES.forest
    const rng = seeded(opts.seed ?? '산')
    const sky = opts.sky ?? '#EAE6DC'
    const sun = opts.sun
    const id = 'g' + Math.floor(rng() * 1e6)

    const rows = [
      { y: h * 0.92, amp: h * 0.10, c: pal[0], rough: 6 },
      { y: h * 0.78, amp: h * 0.20, c: pal[1], rough: 7 },
      { y: h * 0.62, amp: h * 0.34, c: pal[2], rough: 8 },
    ]

    const grad = `<linearGradient id="sky${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky}"/><stop offset="1" stop-color="#F7F3EA"/></linearGradient>`

    let layers = `<rect width="${w}" height="${h}" fill="url(#sky${id})"/>`

    if (sun) {
      const sx = (w * (0.18 + rng() * 0.5)).toFixed(0)
      const sy = (h * 0.34).toFixed(0)
      const sr = (h * 0.13).toFixed(0)
      layers += `<circle cx="${sx}" cy="${sy}" r="${sr}" fill="${sun}" opacity="0.9"/>`
    }

    layers += `<rect x="0" y="${(h * 0.5).toFixed(0)}" width="${w}" height="${(h * 0.18).toFixed(0)}" fill="#fff" opacity="0.16"/>`

    for (let i = rows.length - 1; i >= 0; i--) {
      layers += `<path d="${ridgePath(rng, w, h, rows[i].y, rows[i].amp, rows[i].rough)}" fill="${rows[i].c}"/>`
    }

    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:100%"><defs>${grad}</defs>${layers}</svg>`
  })
}

export interface ContourOpts {
  seed?: string
  stroke?: string
  opacity?: number
  cx?: number
  cy?: number
  rings?: number
  w?: number
  h?: number
}

export function contour(opts: ContourOpts = {}): string {
  return _cached(JSON.stringify(opts), () => {
    const w = opts.w ?? 600
    const h = opts.h ?? 300
    const stroke = opts.stroke ?? '#8AA396'
    const op = opts.opacity ?? 0.5
    const rng = seeded(opts.seed ?? 'contour')
    const cx = w * (opts.cx ?? 0.5)
    const cy = h * (opts.cy ?? 0.5)
    const rings = opts.rings ?? 7

    let paths = ''
    for (let i = 1; i <= rings; i++) {
      const rx = (i / rings) * w * (0.55 + rng() * 0.1)
      const ry = (i / rings) * h * (0.6 + rng() * 0.12)
      const jx = (rng() - 0.5) * 20
      const jy = (rng() - 0.5) * 16
      const d =
        `M${(cx - rx + jx).toFixed(1)},${cy.toFixed(1)} ` +
        `C${(cx - rx).toFixed(1)},${(cy - ry * 0.7).toFixed(1)} ${(cx + rx * 0.6).toFixed(1)},${(cy - ry).toFixed(1)} ${(cx + rx + jx).toFixed(1)},${(cy + jy).toFixed(1)} ` +
        `C${(cx + rx).toFixed(1)},${(cy + ry * 0.7).toFixed(1)} ${(cx - rx * 0.6).toFixed(1)},${(cy + ry).toFixed(1)} ${(cx - rx + jx).toFixed(1)},${cy.toFixed(1)} Z`
      paths += `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="1.2"/>`
    }

    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;height:100%;opacity:${op}">${paths}</svg>`
  })
}
