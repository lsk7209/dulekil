import dotenv from 'dotenv'
import { getCoursesByMountainId, getMountainsForHub } from '../lib/db/queries'
import { buildAccessNotes, buildFallbackRoutes, buildMountainDeepInfo, buildMountainFaqs, buildMountainFitNotes, buildMountainMetaDescription, buildMountainSummary, buildSafetyChecks, buildSeasonNotes, getMountainFallbackGuide, hasMountainIdentityNote } from '../lib/mountain-content'

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
    const deepInfo = buildMountainDeepInfo(mountain, courses)
    const fallbackRoutes = buildFallbackRoutes(mountain, courses)
    const faqs = buildMountainFaqs(mountain, courses)
    const metaDescription = buildMountainMetaDescription(mountain, courses)
    const fits = buildMountainFitNotes(mountain, courses)
    const access = buildAccessNotes(mountain, courses)
    const seasons = buildSeasonNotes(mountain)
    const safety = buildSafetyChecks(courses)

    if (!hasMountainIdentityNote(mountain.name)) addFinding(mountain.id, mountain.name, 'missing mountain-specific identity profile')
    if (summary.length < 3) addFinding(mountain.id, mountain.name, 'summary has fewer than 3 decision points')
    if (deepInfo.intro.length < 140) addFinding(mountain.id, mountain.name, 'deep mountain intro is too short')
    if (deepInfo.highlights.length < 4) addFinding(mountain.id, mountain.name, 'deep mountain guide has fewer than 4 sections')
    if (deepInfo.highlights.some(item => item.body.length < 170)) addFinding(mountain.id, mountain.name, 'deep mountain guide section is too thin')
    if (deepInfo.sources.length === 0) addFinding(mountain.id, mountain.name, 'missing official source links')
    if (faqs.length < 7) addFinding(mountain.id, mountain.name, 'FAQ has fewer than 7 questions')
    if (!metaDescription.startsWith(`${mountain.name} 등산 코스`)) addFinding(mountain.id, mountain.name, 'meta description does not lead with target keyword')
    if (metaDescription.length < 80 || metaDescription.length > 160) addFinding(mountain.id, mountain.name, 'meta description length is outside SEO range')
    if (fits.length < 3) addFinding(mountain.id, mountain.name, 'missing audience-specific course guidance')
    if (seasons.length < 4) addFinding(mountain.id, mountain.name, 'missing four-season guidance')
    if (safety.checks.length < 3) addFinding(mountain.id, mountain.name, 'missing safety checklist')
    if (!access.body) addFinding(mountain.id, mountain.name, 'missing access guidance')
    if (!mountain.description || mountain.description.length < 60) addWarning(mountain.id, mountain.name, 'short mountain description')
    if (courses.length === 0 && !getMountainFallbackGuide(mountain.name)) {
      addWarning(mountain.id, mountain.name, 'no course rows in Turso and no fallback guide')
    }
    if (courses.length === 0 && fallbackRoutes.length < 2) {
      addFinding(mountain.id, mountain.name, 'missing fallback route plan for no-course mountain')
    }
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
