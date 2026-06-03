/**
 * 산림청 공식 100대 명산 목록을 mountains 테이블에 시드
 * is_top100 = true 마킹. 이미 있으면 업데이트.
 */
import { db, schema } from './db-client'
import { sql } from 'drizzle-orm'

// 산림청 공식 100대 명산 (2002년 선정) + 지역 정보
const TOP100: { name: string; region: string; sigun?: string; elev?: number; pal: string }[] = [
  { name: '가리산',      region: '강원',  sigun: '홍천',    elev: 1051, pal: 'forest'  },
  { name: '가야산',      region: '경남',  sigun: '합천/성주', elev: 1430, pal: 'dawn'    },
  { name: '가지산',      region: '울산',  sigun: '울주',    elev: 1241, pal: 'valley'  },
  { name: '감악산',      region: '경기',  sigun: '파주',    elev: 675,  pal: 'sage'    },
  { name: '강천산',      region: '전북',  sigun: '순창',    elev: 583,  pal: 'autumn'  },
  { name: '계룡산',      region: '충남',  sigun: '공주',    elev: 845,  pal: 'forest'  },
  { name: '계방산',      region: '강원',  sigun: '홍천',    elev: 1577, pal: 'winter'  },
  { name: '공작산',      region: '강원',  sigun: '홍천',    elev: 887,  pal: 'forest'  },
  { name: '관악산',      region: '서울',  sigun: '서울',    elev: 632,  pal: 'sage'    },
  { name: '광덕산',      region: '경기',  sigun: '포천',    elev: 1046, pal: 'autumn'  },
  { name: '구병산',      region: '충북',  sigun: '보은',    elev: 876,  pal: 'forest'  },
  { name: '금수산',      region: '충북',  sigun: '제천',    elev: 1016, pal: 'winter'  },
  { name: '금오산',      region: '경북',  sigun: '구미',    elev: 976,  pal: 'autumn'  },
  { name: '금정산',      region: '부산',  sigun: '부산',    elev: 801,  pal: 'sage'    },
  { name: '기백산',      region: '경남',  sigun: '함양',    elev: 1331, pal: 'dawn'    },
  { name: '남덕유산',    region: '경남',  sigun: '함양',    elev: 1507, pal: 'forest'  },
  { name: '남산',        region: '경북',  sigun: '경주',    elev: 468,  pal: 'autumn'  },
  { name: '내연산',      region: '경북',  sigun: '포항',    elev: 710,  pal: 'valley'  },
  { name: '내장산',      region: '전북',  sigun: '정읍',    elev: 763,  pal: 'autumn'  },
  { name: '대둔산',      region: '충남',  sigun: '논산',    elev: 878,  pal: 'autumn'  },
  { name: '대야산',      region: '경북',  sigun: '문경',    elev: 930,  pal: 'forest'  },
  { name: '덕숭산',      region: '충남',  sigun: '예산',    elev: 495,  pal: 'sage'    },
  { name: '덕유산',      region: '전북',  sigun: '무주',    elev: 1614, pal: 'winter'  },
  { name: '도락산',      region: '충북',  sigun: '단양',    elev: 964,  pal: 'forest'  },
  { name: '도봉산',      region: '서울',  sigun: '서울',    elev: 740,  pal: 'dawn'    },
  { name: '두륜산',      region: '전남',  sigun: '해남',    elev: 703,  pal: 'valley'  },
  { name: '두타산',      region: '강원',  sigun: '동해',    elev: 1353, pal: 'forest'  },
  { name: '마니산',      region: '인천',  sigun: '강화',    elev: 469,  pal: 'sage'    },
  { name: '마이산',      region: '전북',  sigun: '진안',    elev: 686,  pal: 'autumn'  },
  { name: '명성산',      region: '경기',  sigun: '포천',    elev: 923,  pal: 'autumn'  },
  { name: '명지산',      region: '경기',  sigun: '가평',    elev: 1267, pal: 'forest'  },
  { name: '모악산',      region: '전북',  sigun: '김제',    elev: 794,  pal: 'valley'  },
  { name: '무등산',      region: '광주',  sigun: '광주',    elev: 1187, pal: 'dawn'    },
  { name: '무학산',      region: '경남',  sigun: '창원',    elev: 761,  pal: 'sage'    },
  { name: '민주지산',    region: '충북',  sigun: '영동',    elev: 1242, pal: 'forest'  },
  { name: '방태산',      region: '강원',  sigun: '인제',    elev: 1444, pal: 'valley'  },
  { name: '백덕산',      region: '강원',  sigun: '영월',    elev: 1350, pal: 'winter'  },
  { name: '백운산',      region: '전남',  sigun: '광양',    elev: 1222, pal: 'forest'  },
  { name: '변산',        region: '전북',  sigun: '부안',    elev: 508,  pal: 'valley'  },
  { name: '북한산',      region: '서울',  sigun: '서울/고양', elev: 836,  pal: 'dawn'    },
  { name: '불암산',      region: '서울',  sigun: '서울',    elev: 509,  pal: 'sage'    },
  { name: '비슬산',      region: '대구',  sigun: '달성',    elev: 1084, pal: 'autumn'  },
  { name: '사량도지리산', region: '경남', sigun: '통영',    elev: 398,  pal: 'valley'  },
  { name: '소백산',      region: '충북',  sigun: '단양',    elev: 1439, pal: 'winter'  },
  { name: '속리산',      region: '충북',  sigun: '보은',    elev: 1058, pal: 'forest'  },
  { name: '수락산',      region: '서울',  sigun: '서울',    elev: 638,  pal: 'sage'    },
  { name: '신불산',      region: '울산',  sigun: '울주',    elev: 1209, pal: 'dawn'    },
  { name: '연화산',      region: '경남',  sigun: '고성',    elev: 528,  pal: 'valley'  },
  { name: '오대산',      region: '강원',  sigun: '평창',    elev: 1563, pal: 'winter'  },
  { name: '오봉산',      region: '강원',  sigun: '춘천',    elev: 779,  pal: 'forest'  },
  { name: '용문산',      region: '경기',  sigun: '양평',    elev: 1157, pal: 'autumn'  },
  { name: '용화산',      region: '강원',  sigun: '화천',    elev: 878,  pal: 'forest'  },
  { name: '운달산',      region: '경북',  sigun: '문경',    elev: 1097, pal: 'forest'  },
  { name: '운문산',      region: '경북',  sigun: '청도',    elev: 1188, pal: 'valley'  },
  { name: '월악산',      region: '충북',  sigun: '제천',    elev: 1097, pal: 'dawn'    },
  { name: '월출산',      region: '전남',  sigun: '영암',    elev: 809,  pal: 'autumn'  },
  { name: '유명산',      region: '경기',  sigun: '가평',    elev: 862,  pal: 'valley'  },
  { name: '응봉산',      region: '강원',  sigun: '울진',    elev: 999,  pal: 'forest'  },
  { name: '장안산',      region: '전북',  sigun: '장수',    elev: 1237, pal: 'forest'  },
  { name: '재약산',      region: '경남',  sigun: '밀양',    elev: 1189, pal: 'dawn'    },
  { name: '적상산',      region: '전북',  sigun: '무주',    elev: 1034, pal: 'autumn'  },
  { name: '주왕산',      region: '경북',  sigun: '청송',    elev: 722,  pal: 'autumn'  },
  { name: '주흘산',      region: '경북',  sigun: '문경',    elev: 1106, pal: 'forest'  },
  { name: '지리산',      region: '전남',  sigun: '구례',    elev: 1915, pal: 'dawn'    },
  { name: '천관산',      region: '전남',  sigun: '장흥',    elev: 723,  pal: 'valley'  },
  { name: '천마산',      region: '경기',  sigun: '남양주',  elev: 812,  pal: 'forest'  },
  { name: '천성산',      region: '경남',  sigun: '양산',    elev: 922,  pal: 'sage'    },
  { name: '천왕산',      region: '경남',  sigun: '밀양',    elev: 1189, pal: 'dawn'    },
  { name: '청량산',      region: '경북',  sigun: '봉화',    elev: 870,  pal: 'autumn'  },
  { name: '청화산',      region: '충북',  sigun: '괴산',    elev: 984,  pal: 'forest'  },
  { name: '축령산',      region: '경기',  sigun: '남양주',  elev: 879,  pal: 'forest'  },
  { name: '치악산',      region: '강원',  sigun: '원주',    elev: 1288, pal: 'forest'  },
  { name: '칠갑산',      region: '충남',  sigun: '청양',    elev: 561,  pal: 'autumn'  },
  { name: '태백산',      region: '강원',  sigun: '태백',    elev: 1567, pal: 'winter'  },
  { name: '팔공산',      region: '대구',  sigun: '대구/경산', elev: 1193, pal: 'dawn'    },
  { name: '팔봉산',      region: '강원',  sigun: '홍천',    elev: 302,  pal: 'sage'    },
  { name: '학가산',      region: '경북',  sigun: '안동',    elev: 882,  pal: 'forest'  },
  { name: '한라산',      region: '제주',  sigun: '제주',    elev: 1950, pal: 'winter'  },
  { name: '함백산',      region: '강원',  sigun: '정선',    elev: 1573, pal: 'winter'  },
  { name: '향로봉',      region: '강원',  sigun: '고성',    elev: 1296, pal: 'forest'  },
  { name: '화악산',      region: '경기',  sigun: '가평',    elev: 1468, pal: 'winter'  },
  { name: '화왕산',      region: '경남',  sigun: '창녕',    elev: 757,  pal: 'autumn'  },
  { name: '황매산',      region: '경남',  sigun: '합천',    elev: 1108, pal: 'autumn'  },
  { name: '황석산',      region: '경남',  sigun: '함양',    elev: 1190, pal: 'forest'  },
  { name: '황악산',      region: '경북',  sigun: '김천',    elev: 1111, pal: 'forest'  },
  { name: '황장산',      region: '경북',  sigun: '문경',    elev: 1077, pal: 'forest'  },
  { name: '회문산',      region: '전북',  sigun: '순창',    elev: 837,  pal: 'forest'  },
  { name: '운장산',      region: '전북',  sigun: '완주',    elev: 1125, pal: 'valley'  },
  { name: '갑장산',      region: '경북',  sigun: '상주',    elev: 806,  pal: 'autumn'  },
  { name: '오서산',      region: '충남',  sigun: '홍성',    elev: 791,  pal: 'sage'    },
  { name: '팔영산',      region: '전남',  sigun: '고흥',    elev: 609,  pal: 'valley'  },
  { name: '장성축령산',  region: '전남',  sigun: '장성',    elev: 621,  pal: 'forest'  },
  { name: '백운산',      region: '경기',  sigun: '포천',    elev: 904,  pal: 'winter'  },
  // 경주 남산 = 남산(경주) - 이미 위에 있음 / 제주 한라산 = 한라산 - 이미 위에 있음
]

function toSlug(name: string): string {
  return name.replace(/\s+/g, '').replace(/[^가-힣a-zA-Z0-9-]/g, '')
}

async function main() {
  console.log('[seed-top100] 100대 명산 시드 시작...')

  let inserted = 0
  let updated = 0

  for (const m of TOP100) {
    const slug = toSlug(m.name)

    // name 기준 upsert — 중복 name은 is_top100만 업데이트
    const existing = await db.query.mountains.findFirst({
      where: (t, { eq }) => eq(t.name, m.name),
    })

    if (existing) {
      await db
        .update(schema.mountains)
        .set({ is_top100: true, pal: m.pal, region: m.region, sigun: m.sigun, elev: m.elev })
        .where(sql`id = ${existing.id}`)
      updated++
    } else {
      await db.insert(schema.mountains).values({
        name:       m.name,
        region:     m.region,
        sigun:      m.sigun,
        elev:       m.elev,
        is_top100:  true,
        pal:        m.pal,
        slug:       slug,
      }).onConflictDoNothing()
      inserted++
    }
  }

  console.log(`✅ 완료 — 신규: ${inserted}, 업데이트: ${updated}, 전체: ${TOP100.length}`)
  process.exit(0)
}

main().catch(e => { console.error(e); process.exit(1) })
