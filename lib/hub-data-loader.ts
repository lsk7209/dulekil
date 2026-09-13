import type { HubDataState } from './data-source-state'

export interface HubDataReader<Mountain extends { id: number }, Stat> {
  findMountains(): Promise<Mountain[]>
  findStats(mountainIds: number[]): Promise<Stat[]>
}

export interface HubDataLoad<Item> {
  mountains: Item[]
  state: HubDataState
}

interface HubDataLoadOptions<Mountain extends { id: number }, Stat, Item> {
  configured: boolean
  reader: HubDataReader<Mountain, Stat>
  fallback: () => Item[]
  build: (mountains: Mountain[], stats: Stat[]) => Item[]
  markUncached: () => void
}

export async function loadHubDataFromReader<Mountain extends { id: number }, Stat, Item>(
  options: HubDataLoadOptions<Mountain, Stat, Item>,
): Promise<HubDataLoad<Item>> {
  if (!options.configured) {
    options.markUncached()
    return { mountains: options.fallback(), state: 'static-no-config' }
  }

  try {
    const mountains = await options.reader.findMountains()
    if (mountains.length === 0) {
      options.markUncached()
      return { mountains: [], state: 'static-empty' }
    }

    const stats = await options.reader.findStats(mountains.map(mountain => mountain.id))
    return { mountains: options.build(mountains, stats), state: 'database' }
  } catch {
    options.markUncached()
    return { mountains: options.fallback(), state: 'static-unavailable' }
  }
}
