import dotenv from 'dotenv'
import { getCoursesByMountainId, getMountainsForHub } from '../lib/db/queries'
import { buildAccessNotes, buildMountainFitNotes, buildMountainSummary, buildSafetyChecks, buildSeasonNotes } from '../lib/mountain-content'

dotenv.config({ path: '.env.local', quiet: true })

type Finding = {
  id: number
  name: string
  path: string
  reason: string
}

const findings: Finding[] = []
const warnings: Finding[] = []

function addFinding(id: number, name: string, reason: string) {
  findings.push({ id, name, path: `/mountains/${encodeURIComponent(name)}`, reason })
}

function addWarning(id: number, name: string, reason: string) {
  warnings.push({ id, name, path: `/mountains/${encodeURIComponent(name)}`, reason })
}

async function main() {
  const mountains = await getMountainsForHub()

  for (const mountain of mountains) {
    const courses = await getCoursesByMountainId(mountain.id)
    const summary = buildMountainSummary(mountain, courses)
    const fits = buildMountainFitNotes(mountain, courses)
    const access = buildAccessNotes(mountain, courses)
    const seasons = buildSeasonNotes(mountain)
    const safety = buildSafetyChecks(courses)

    if (summary.length < 3) addFinding(mountain.id, mountain.name, 'summary has fewer than 3 decision points')
    if (fits.length < 3) addFinding(mountain.id, mountain.name, 'missing audience-specific course guidance')
    if (seasons.length < 4) addFinding(mountain.id, mountain.name, 'missing four-season guidance')
    if (safety.checks.length < 3) addFinding(mountain.id, mountain.name, 'missing safety checklist')
    if (!access.body) addFinding(mountain.id, mountain.name, 'missing access guidance')
    if (!mountain.description || mountain.description.length < 60) addWarning(mountain.id, mountain.name, 'short mountain description')
    if (courses.length === 0) addWarning(mountain.id, mountain.name, 'no course rows in Turso')
    if (courses.length > 0 && !courses.some(course => course.distance && course.distance > 0)) {
      addWarning(mountain.id, mountain.name, 'course distance values missing')
    }
  }

  const report = {
    checkedAt: new Date().toISOString(),
    totalMountains: mountains.length,
    findings: findings.slice(0, 100),
    findingCount: findings.length,
    warnings: warnings.slice(0, 100),
    warningCount: warnings.length,
  }

  console.log(JSON.stringify(report, null, 2))

  if (findings.length > 0) {
    process.exitCode = 1
  }
}

main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
