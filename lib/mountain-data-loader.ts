import type { HubDataState } from './data-source-state'

export interface MountainDataReader<Mountain extends { id: number }, Course> {
  findMountain(slug: string): Promise<Mountain | null>
  findCourses(mountainId: number): Promise<Course[]>
}

export interface MountainDetailLoad<Mountain, Course> {
  mountain: Mountain | null
  courses: Course[]
  state: HubDataState
}

export async function loadMountainDetailFromReader<Mountain extends { id: number }, Course>(
  reader: MountainDataReader<Mountain, Course>,
  slug: string,
  fallback: (slug: string) => Mountain | null,
): Promise<MountainDetailLoad<Mountain, Course>> {
  let mountain: Mountain | null
  try {
    mountain = await reader.findMountain(slug)
  } catch {
    return { mountain: fallback(slug), courses: [], state: 'static-unavailable' }
  }

  if (!mountain) {
    const fallbackMountain = fallback(slug)
    return {
      mountain: fallbackMountain,
      courses: [],
      state: fallbackMountain ? 'static-missing-record' : 'database',
    }
  }

  try {
    return { mountain, courses: await reader.findCourses(mountain.id), state: 'database' }
  } catch {
    return { mountain, courses: [], state: 'database-partial' }
  }
}
