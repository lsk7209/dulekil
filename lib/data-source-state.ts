export type HubDataState =
  | 'database'
  | 'database-partial'
  | 'static-no-config'
  | 'static-empty'
  | 'static-missing-record'
  | 'static-unavailable'

export function resolveHubDataState(input: {
  configured: boolean
  rowCount?: number
  failed?: boolean
}): HubDataState {
  if (!input.configured) return 'static-no-config'
  if (input.failed) return 'static-unavailable'
  if ((input.rowCount ?? 0) === 0) return 'static-empty'
  return 'database'
}
