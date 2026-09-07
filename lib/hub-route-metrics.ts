export function hubDistance(value: number | null | undefined): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Number(value.toFixed(1)) : null
}

export function hubDuration(value: number | null | undefined): string {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return '자료 없음'
  const minutes = Math.round(value)
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`
}

export function compareHubDistance(a: { dist: number | null }, b: { dist: number | null }): number {
  if (a.dist === null) return b.dist === null ? 0 : 1
  if (b.dist === null) return -1
  return a.dist - b.dist
}
