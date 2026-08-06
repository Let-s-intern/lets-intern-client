import type {
  AccessLogApplicationDetail,
  AccessLogDetail,
  AccessLogRow,
} from '@/api/accessLog';

/**
 * 이용 로그 목 시드 (LC-3201).
 *
 * 이 화면에서 가장 사고가 나기 쉬운 지점은 "기록이 없다"의 세 가지 이유를 구분하지 못하는 것이다.
 * 집계 이전 결제가 `미이용` 으로 보이면 운영이 잘못된 전액 환불을 실행한다.
 * 그래서 시드는 그 세 갈래와 경계 케이스를 모두 담는다.
 *
 * 날짜는 모듈 로드 시점 기준 상대값으로 만든다. 하드코딩하면 시간이 지나면서
 * "결제 후 7일 이내" 케이스가 조용히 무너져 강조 표시를 확인할 수 없게 된다.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

const LOADED_AT = Date.now();

/** 서버 LocalDateTime 과 같은 모양(`2026-08-06T09:00:00`)으로 만든다. */
const serverDateTime = (msFromNow: number) => {
  const date = new Date(LOADED_AT + msFromNow);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 19);
};

const daysAgo = (days: number) => serverDateTime(-days * DAY_MS);

/**
 * 집계 시작 시각. 응답 최상위에 한 번만 실린다.
 *
 * 고정 상수지만 절대 날짜로 박지 않는다. 절대 날짜로 두면 시간이 흐를수록
 * "집계 이전" 결제를 만들 수 있는 구간이 계속 멀어져 케이스가 어색해진다.
 */
export const MOCK_TRACKED_FROM = daysAgo(60);

export const seedAccessLogs: AccessLogRow[] = [
  // 1. 정상 이용 — 결제 후 2일 뒤 최초 이용. 대시보드 1 + 미션 3
  {
    applicationId: 6001,
    userId: 13101,
    userName: '김렛츠',
    userEmail: 'lets@example.com',
    programType: 'CHALLENGE',
    programId: 319,
    programTitle: '[스타트업 Ver.] 면접 준비 7일 끝장 챌린지 7기',
    paidAt: daysAgo(10),
    firstAccessedAt: daysAgo(8),
    lastAccessedAt: daysAgo(1),
    accessCount: 12,
    daysFromPaymentToFirstAccess: 2,
    targetSummary: [
      { targetType: 'CHALLENGE_DASHBOARD', count: 1 },
      { targetType: 'MISSION', count: 3 },
    ],
  },
  // 2. 집계 이전 — 결제가 trackedFrom 보다 앞선다. 미이용이 아니라 소급 불가다.
  {
    applicationId: 6002,
    userId: 13102,
    userName: '박이전',
    userEmail: 'before@example.com',
    programType: 'CHALLENGE',
    programId: 300,
    programTitle: '[대기업 Ver.] 경험정리 챌린지 18기',
    paidAt: daysAgo(90),
    firstAccessedAt: null,
    lastAccessedAt: null,
    accessCount: 0,
    daysFromPaymentToFirstAccess: null,
    targetSummary: [],
  },
  // 3. 미이용 · 결제 후 7일 이내 — 목록에서 눈에 띄어야 하는 행
  {
    applicationId: 6003,
    userId: 13103,
    userName: '최최근',
    userEmail: 'recent@example.com',
    programType: 'CHALLENGE',
    programId: 319,
    programTitle: '[스타트업 Ver.] 면접 준비 7일 끝장 챌린지 7기',
    paidAt: daysAgo(2),
    firstAccessedAt: null,
    lastAccessedAt: null,
    accessCount: 0,
    daysFromPaymentToFirstAccess: null,
    targetSummary: [],
  },
  // 4. 미이용이지만 7일이 지난 건 — 3번의 대조군. 강조되지 않아야 한다.
  {
    applicationId: 6004,
    userId: 13104,
    userName: '한지남',
    userEmail: 'passed@example.com',
    programType: 'CHALLENGE',
    programId: 319,
    programTitle: '[스타트업 Ver.] 면접 준비 7일 끝장 챌린지 7기',
    paidAt: daysAgo(20),
    firstAccessedAt: null,
    lastAccessedAt: null,
    accessCount: 0,
    daysFromPaymentToFirstAccess: null,
    targetSummary: [],
  },
  // 5. 대시보드만 12회 — "12회"라는 숫자만으로는 판단할 수 없다는 사례
  {
    applicationId: 6005,
    userId: 13105,
    userName: '오새로',
    userEmail: 'refresh@example.com',
    programType: 'CHALLENGE',
    programId: 319,
    programTitle: '[스타트업 Ver.] 면접 준비 7일 끝장 챌린지 7기',
    paidAt: daysAgo(15),
    firstAccessedAt: daysAgo(14),
    lastAccessedAt: daysAgo(3),
    accessCount: 12,
    daysFromPaymentToFirstAccess: 1,
    targetSummary: [{ targetType: 'CHALLENGE_DASHBOARD', count: 1 }],
  },
  // 6-1. VOD — 대상이 프로그램 하나뿐이다.
  {
    applicationId: 6006,
    userId: 13106,
    userName: '정브이',
    userEmail: 'vod@example.com',
    programType: 'VOD',
    programId: 88,
    programTitle: '자소서 완성 VOD',
    paidAt: daysAgo(12),
    firstAccessedAt: daysAgo(12),
    lastAccessedAt: daysAgo(12),
    accessCount: 1,
    daysFromPaymentToFirstAccess: 0,
    targetSummary: [{ targetType: 'PROGRAM', count: 1 }],
  },
  // 6-2. GUIDEBOOK — 다운로드 1회
  {
    applicationId: 6007,
    userId: 13107,
    userName: '윤가이',
    userEmail: 'guide@example.com',
    programType: 'GUIDEBOOK',
    programId: 45,
    programTitle: '취업 준비 가이드북',
    paidAt: daysAgo(30),
    firstAccessedAt: daysAgo(29),
    lastAccessedAt: daysAgo(29),
    accessCount: 1,
    daysFromPaymentToFirstAccess: 1,
    targetSummary: [{ targetType: 'PROGRAM', count: 1 }],
  },
  // 7. 결제 시각을 알 수 없는 건 — 판정 근거가 없으므로 `확인 불가` 로 떨어진다.
  //    미이용으로 단정하면 안 되는 경로를 화면에서 확인하기 위한 행이다.
  {
    applicationId: 6008,
    userId: null,
    userName: null,
    userEmail: null,
    programType: 'CHALLENGE',
    programId: 319,
    programTitle: '[스타트업 Ver.] 면접 준비 7일 끝장 챌린지 7기',
    paidAt: null,
    firstAccessedAt: null,
    lastAccessedAt: null,
    accessCount: 0,
    daysFromPaymentToFirstAccess: null,
    targetSummary: [],
  },
  // 8. 적재 대상이 아닌 타입(LIVE) — 목록 API 가 신청서 기준 left join 이라 행으로는 내려온다.
  //    결제 7일 이내 · 기록 없음이라 방어가 없으면 `미이용` 으로 강조까지 되는 행이다.
  //    실제로는 애초에 기록하지 않는 타입이라 이용 여부를 말할 수 없다(PRD 5.2).
  {
    applicationId: 6009,
    userId: 13109,
    userName: '강라이',
    userEmail: 'live@example.com',
    programType: 'LIVE',
    programId: 501,
    programTitle: '현직자 라이브 클래스 3기',
    paidAt: daysAgo(3),
    firstAccessedAt: null,
    lastAccessedAt: null,
    accessCount: 0,
    daysFromPaymentToFirstAccess: null,
    targetSummary: [],
  },
];

/**
 * 행을 펼쳤을 때 보이는 대상별 낱개 내역 (PRD 7.3).
 *
 * 목록의 `targetSummary` 와 개수가, `accessCount` 와 합계가 맞아야 한다.
 * 어긋나면 목으로 화면을 검증하는 의미가 사라진다 — 표가 `미션 3건` 이라고 적어 놓고
 * 펼치면 두 줄만 나오는 화면을 보고도 버그인지 목이 틀린 건지 알 수 없다.
 *
 * 그래서 여기에는 `details` 만 적고, 요약 필드는 아래에서 목록 시드로부터 그대로 가져온다.
 */
const seedDetailsByApplicationId: Record<number, AccessLogDetail[]> = {
  // 6001 — PRD 7.3 예시와 같은 모양. 대시보드 1 + 미션 3, 횟수 합계 8+2+1+1 = 12
  6001: [
    {
      targetType: 'CHALLENGE_DASHBOARD',
      targetId: 319,
      targetTitle: '[스타트업 Ver.] 면접 준비 7일 끝장 챌린지 7기',
      missionTh: null,
      firstAccessedAt: daysAgo(8),
      lastAccessedAt: daysAgo(1),
      accessCount: 8,
    },
    {
      targetType: 'MISSION',
      targetId: 9001,
      targetTitle: '경험 정리하기',
      missionTh: 3,
      firstAccessedAt: daysAgo(7),
      lastAccessedAt: daysAgo(7),
      accessCount: 2,
    },
    {
      targetType: 'MISSION',
      targetId: 9002,
      targetTitle: '직무 탐색하기',
      missionTh: 5,
      firstAccessedAt: daysAgo(5),
      lastAccessedAt: daysAgo(5),
      accessCount: 1,
    },
    {
      targetType: 'MISSION',
      targetId: 9003,
      targetTitle: '면접 예상 질문 뽑기',
      missionTh: 7,
      firstAccessedAt: daysAgo(2),
      lastAccessedAt: daysAgo(2),
      accessCount: 1,
    },
  ],
  // 6005 — 대시보드만 12회. 펼쳐야 "12회가 전부 대시보드였다"는 사실이 드러난다.
  6005: [
    {
      targetType: 'CHALLENGE_DASHBOARD',
      targetId: 319,
      targetTitle: '[스타트업 Ver.] 면접 준비 7일 끝장 챌린지 7기',
      missionTh: null,
      firstAccessedAt: daysAgo(14),
      lastAccessedAt: daysAgo(3),
      accessCount: 12,
    },
  ],
  // 6006 · 6007 — VOD·가이드북은 대상이 하나뿐이라 펼쳐도 한 줄이다.
  6006: [
    {
      targetType: 'PROGRAM',
      targetId: 88,
      targetTitle: '자소서 완성 VOD',
      missionTh: null,
      firstAccessedAt: daysAgo(12),
      lastAccessedAt: daysAgo(12),
      accessCount: 1,
    },
  ],
  6007: [
    {
      targetType: 'PROGRAM',
      targetId: 45,
      targetTitle: '취업 준비 가이드북',
      missionTh: null,
      firstAccessedAt: daysAgo(29),
      lastAccessedAt: daysAgo(29),
      accessCount: 1,
    },
  ],
  // 6002 · 6003 · 6004 · 6008 · 6009 는 이용 기록이 없어 details 가 빈 배열이다.
  // 빈 배열은 "왜 없는지"를 말해 주지 않는다 — 상세 화면이 상위 행의 판정을 물려받아
  // 집계 대상 아님 / 집계 이전 / 미이용 / 확인 불가 를 구분해 적어야 한다(PRD 7.4).
};

/**
 * 단건 조회 응답. 요약 필드는 목록 시드에서 그대로 가져온다.
 *
 * 손으로 다시 적으면 목록과 상세가 서로 다른 숫자를 말하게 된다.
 */
export const seedAccessLogDetails: Record<number, AccessLogApplicationDetail> =
  Object.fromEntries(
    seedAccessLogs.map((row) => [
      row.applicationId,
      {
        firstAccessedAt: row.firstAccessedAt ?? null,
        lastAccessedAt: row.lastAccessedAt ?? null,
        accessCount: row.accessCount ?? 0,
        paidAt: row.paidAt ?? null,
        daysFromPaymentToFirstAccess: row.daysFromPaymentToFirstAccess ?? null,
        trackedFrom: MOCK_TRACKED_FROM,
        details: seedDetailsByApplicationId[row.applicationId] ?? [],
      },
    ]),
  );
