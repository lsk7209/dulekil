import type { HubDataState } from './data-source-state'

export function canPublishDatabaseDerivedData(state: HubDataState): boolean {
  return state === 'database'
}
