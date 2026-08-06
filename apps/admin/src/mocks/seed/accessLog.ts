import type { AccessLogRow } from '@/api/accessLog';

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
];
