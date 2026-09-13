export const COMPLETION_STORAGE_KEY = 'dulle_done_v1'

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

export function readCompletionNames(storage: StorageLike): Set<string> {
  try {
    const parsed: unknown = JSON.parse(storage.getItem(COMPLETION_STORAGE_KEY) ?? '[]')
    if (!Array.isArray(parsed)) return new Set()
    return new Set(parsed.filter((value): value is string => typeof value === 'string' && value.length > 0))
  } catch {
    return new Set()
  }
}

export function writeCompletionNames(storage: StorageLike, names: Set<string>): boolean {
  try {
    storage.setItem(COMPLETION_STORAGE_KEY, JSON.stringify([...names]))
    return true
  } catch {
    return false
  }
}
