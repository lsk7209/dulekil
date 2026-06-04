/**
 * 산 이름 → 관련 블로그 포스트 ID 매핑
 * 산 상세 페이지 하단 "관련 가이드" 섹션에 사용
 */
import { POSTS, type Post } from '@/lib/posts'

// 특정 산 이름 → 관련 포스트 ID (직접 매핑)
const DIRECT_MAP: Record<string, string[]> = {
  '설악산':   ['p10', 'p14', 'p3', 'p1'],
  '북한산':   ['p1', 'p7', 'p11', 'p2'],
  '도봉산':   ['p7', 'p1', 'p11', 'p2'],
  '지리산':   ['p4', 'p2', 'p9', 'p6'],
  '한라산':   ['p21', 'p34', 'p2', 'p8'],
  '관악산':   ['p1', 'p11', 'p2', 'p13'],
  '수락산':   ['p1', 'p11', 'p2'],
  '불암산':   ['p1', 'p11', 'p2'],
  '청계산':   ['p1', 'p11', 'p2'],
  '덕유산':   ['p22', 'p14', 'p3', 'p8'],
  '소백산':   ['p23', 'p14', 'p9', 'p3'],
  '오대산':   ['p24', 'p9', 'p6', 'p8'],
  '태백산':   ['p25', 'p14', 'p3', 'p9'],
  '속리산':   ['p26', 'p33', 'p2', 'p9'],
  '가야산':   ['p27', 'p31', 'p9', 'p6'],
  '월악산':   ['p28', 'p33', 'p2', 'p13'],
  '치악산':   ['p29', 'p9', 'p3', 'p8'],
  '내장산':   ['p32', 'p9', 'p6', 'p54'],
  '월출산':   ['p32', 'p52', 'p9', 'p6'],
  '계룡산':   ['p33', 'p53', 'p2', 'p11'],
  '두타산':   ['p30', 'p9', 'p6', 'p8'],
  '방태산':   ['p30', 'p9', 'p6'],
  '금오산':   ['p31', 'p9', 'p2'],
  '금정산':   ['p31', 'p11', 'p2'],
  '무등산':   ['p32', 'p11', 'p9'],
  '팔공산':   ['p31', 'p9', 'p2'],
  '황매산':   ['p31', 'p9', 'p6'],
  '남산':     ['p31', 'p11', 'p9'],
  '마이산':   ['p32', 'p9', 'p6'],
  '모악산':   ['p32', 'p9', 'p6'],
}

// 지역 → 관련 포스트 (fallback)
const REGION_MAP: Record<string, string[]> = {
  '수도권': ['p1', 'p11', 'p7', 'p2'],
  '강원':   ['p30', 'p14', 'p9', 'p10'],
  '충청':   ['p33', 'p2', 'p9', 'p6'],
  '영남':   ['p31', 'p9', 'p6', 'p2'],
  '호남':   ['p32', 'p9', 'p6', 'p2'],
  '제주':   ['p21', 'p34', 'p2', 'p8'],
}

// 기본 추천 (어느 산에도 해당 없을 때)
const DEFAULT_POSTS = ['p2', 'p5', 'p13', 'p8', 'p12']

function isPublished(post: Post): boolean {
  if (!post.publishAt) return true
  return new Date(post.publishAt) <= new Date()
}

function getPostById(id: string): Post | undefined {
  return POSTS.find(p => p.id === id && isPublished(p))
}

export function getRelatedPosts(mountainName: string, regionGroup: string, max = 4): Post[] {
  // 1) 직접 매핑
  const directIds = DIRECT_MAP[mountainName]

  // 2) 제목에 산 이름 포함된 글 자동 탐색
  const autoIds = POSTS
    .filter(p => isPublished(p) && p.title.includes(mountainName))
    .map(p => p.id)

  // 3) 지역 fallback
  const regionIds = REGION_MAP[regionGroup] ?? DEFAULT_POSTS

  // 우선순위대로 합치고 중복 제거
  const ordered = [...new Set([...(directIds ?? []), ...autoIds, ...regionIds])]

  return ordered
    .map(getPostById)
    .filter((p): p is Post => p !== undefined)
    .slice(0, max)
}
