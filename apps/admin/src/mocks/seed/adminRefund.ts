import type { AdminRefundLog, UserRefundItem } from '@/api/adminRefund';

/**
 * 어드민 환불 목 시드.
 *
 * 참여자 목록의 환불여부 라벨이 다섯 갈래로 갈리는데, 그 분기를 한 화면에서 모두 확인할 수
 * 있도록 챌린지 319 에 어드민 환불 건을 섞어 둔다.
 *   applicationId 5003 → 어드민 전체 환불 (아래 로그에 있음 + 환불액 === 원 결제액)
 *   applicationId 5008 → 어드민 부분 환불 (아래 로그에 있음 + 환불액 < 원 결제액)
 *   applicationId 5004 → 유저 전체 환불   (로그 없음 + finalPrice === originalPrice)
 *   applicationId 5005 → 유저 부분 환불   (로그 없음 + finalPrice < originalPrice)
 *   그 외              → N
 */
export const MOCK_REFUND_PROGRAM_ID = 319;

export const seedRefundLogs: AdminRefundLog[] = [
  {
    id: 1,
    refundedAt: '2026-08-03T15:20:00',
    programType: 'CHALLENGE',
    programId: MOCK_REFUND_PROGRAM_ID,
    programTitle: '[스타트업 Ver.] 면접 준비 7일 끝장 챌린지 7기',
    userId: 13023,
    userName: '김채원',
    userEmail: 'chaewon@example.com',
    managerName: '임호정',
    refundedAmount: 330000,
    reason: '프로그램 오결제 — 경력자Ver 재결제 예정',
    status: 'SUCCESS',
    failureMessage: null,
    applicationId: 5003,
    orderId: 'letsMOCK5003',
    paymentKey: 'tviva20260720100000aaaa',
    originalAmount: 330000,
    paidAt: '2026-07-20T10:00:00',
    couponName: null,
    couponDiscount: null,
  },
  {
    // 부분 환불. 원 결제액이 함께 있어야 220,000 이 얼마 중 얼마인지 읽힌다.
    id: 4,
    refundedAt: '2026-08-03T16:10:00',
    programType: 'CHALLENGE',
    programId: MOCK_REFUND_PROGRAM_ID,
    programTitle: '[스타트업 Ver.] 면접 준비 7일 끝장 챌린지 7기',
    userId: 13024,
    userName: '정부분',
    userEmail: 'partial@example.com',
    managerName: '임호정',
    refundedAmount: 220000,
    reason: '중도 이탈 — 진행분 제외하고 정산 (CS 협의값)',
    status: 'SUCCESS',
    failureMessage: null,
    applicationId: 5008,
    orderId: 'letsMOCK5008',
    paymentKey: 'tviva20260720100000bbbb',
    originalAmount: 330000,
    paidAt: '2026-07-20T11:30:00',
    couponName: null,
    couponDiscount: null,
  },
  {
    id: 2,
    refundedAt: '2026-08-02T11:05:00',
    programType: 'LIVE',
    programId: 4005,
    programTitle: '[QA] 라이브 클래스',
    userId: 13100,
    userName: '송채연',
    userEmail: 'chaeyeon@example.com',
    managerName: '송다예',
    refundedAmount: 60000,
    reason: '기수 오결제 — 다음 기수로 이동 요청',
    status: 'SUCCESS',
    failureMessage: null,
    applicationId: 5101,
    orderId: 'letsMOCK5101',
    paymentKey: 'tviva20260715090000cccc',
    originalAmount: 60000,
    paidAt: '2026-07-15T09:00:00',
    couponName: '얼리버드 쿠폰',
    couponDiscount: 10000,
  },
  {
    id: 3,
    refundedAt: '2026-07-30T18:40:00',
    programType: 'CHALLENGE',
    programId: 317,
    programTitle: '포트폴리오 1주 완성 챌린지 35기',
    userId: 13200,
    userName: '허희정',
    userEmail: 'heejung@example.com',
    managerName: '임호정',
    refundedAmount: 0,
    reason: '이미 PG 콘솔에서 환불된 건',
    // 실패 건도 이력에 남는다. 상태 컬럼에 PG 응답이 툴팁으로 붙는다.
    status: 'FAILED',
    failureMessage: '이미 취소된 결제입니다. (TOSS: ALREADY_CANCELED_PAYMENT)',
    applicationId: 5202,
    orderId: 'letsMOCK5202',
    paymentKey: 'tviva20260701080000dddd',
    originalAmount: 250000,
    paidAt: '2026-07-01T08:00:00',
    couponName: null,
    couponDiscount: null,
  },
];

/**
 * 유저 환불 목 시드.
 *
 * 처리경로 두 갈래(USER·SQL)와 환불 범위 두 갈래(FULL·PARTIAL)가 한 화면에 보이도록 섞는다.
 * 어드민 환불 로그가 있는 신청서(5003·5008)는 서버가 이 목록에서 제외하므로 넣지 않는다.
 *
 * 두 값 모두 서버가 계산해 내려준다. 화면은 그대로 받아 쓴다.
 */
export const seedUserRefunds: UserRefundItem[] = [
  {
    // 유저가 직접 취소. 환불 시각이 결제보다 한참 뒤라 근사치를 믿을 수 있다.
    applicationId: 5004,
    paymentId: 9004,
    refundedAt: '2026-08-01T09:12:00',
    paidAt: '2026-07-20T10:00:00',
    programType: 'CHALLENGE',
    programId: MOCK_REFUND_PROGRAM_ID,
    programTitle: '[스타트업 Ver.] 면접 준비 7일 끝장 챌린지 7기',
    userId: 13301,
    userName: '이유저',
    userEmail: 'user@example.com',
    refundedAmount: 330000,
    originalAmount: 330000,
    orderId: 'letsMOCK5004',
    paymentKey: 'tviva20260720100000eeee',
    refundScope: 'FULL',
    refundSource: 'USER',
  },
  {
    // 규정 환불. 진행분을 뺀 금액만 돌려받는다.
    applicationId: 5005,
    paymentId: 9005,
    refundedAt: '2026-07-31T14:03:00',
    paidAt: '2026-07-18T13:20:00',
    programType: 'CHALLENGE',
    programId: MOCK_REFUND_PROGRAM_ID,
    programTitle: '[스타트업 Ver.] 면접 준비 7일 끝장 챌린지 7기',
    userId: 13302,
    userName: '최부분',
    userEmail: 'partialuser@example.com',
    refundedAmount: 220000,
    originalAmount: 330000,
    orderId: 'letsMOCK5005',
    paymentKey: 'tviva20260718132000ffff',
    refundScope: 'PARTIAL',
    refundSource: 'USER',
  },
  {
    // 리포트 배치 자동환불. 서버가 유저 환불과 구분할 단서가 없어 USER 로 분류된다.
    applicationId: 5401,
    paymentId: 9401,
    refundedAt: '2026-07-29T03:00:00',
    paidAt: '2026-07-22T21:10:00',
    programType: 'REPORT',
    programId: 812,
    programTitle: '이력서 서류 진단',
    userId: 13303,
    userName: '남지우',
    userEmail: 'jiwoo@example.com',
    refundedAmount: 19900,
    originalAmount: 19900,
    orderId: 'letsMOCK5401',
    paymentKey: 'tviva20260722211000gggg',
    refundScope: 'FULL',
    refundSource: 'USER',
  },
  {
    // SQL 로 직접 처리한 건. lastModifiedDate 가 createDate 와 사실상 같아
    // 환불 시각을 알 수 없다. 화면에서 일시 칸이 `-` 가 된다.
    applicationId: 5402,
    paymentId: 9402,
    refundedAt: '2026-07-10T11:00:02',
    paidAt: '2026-07-10T11:00:00',
    programType: 'LIVE',
    programId: 4005,
    programTitle: '[QA] 라이브 클래스',
    userId: 13304,
    userName: '오세훈',
    userEmail: 'sehun@example.com',
    refundedAmount: 60000,
    originalAmount: 60000,
    orderId: 'letsMOCK5402',
    paymentKey: 'tviva20260710110000hhhh',
    refundScope: 'FULL',
    refundSource: 'SQL',
  },
  {
    // 0원 결제 취소. originalPrice > 0 을 조건에 넣으면 이 행이 통째로 사라진다.
    applicationId: 5403,
    paymentId: 9403,
    refundedAt: '2026-07-28T16:44:00',
    paidAt: '2026-07-21T08:30:00',
    programType: 'CHALLENGE',
    programId: 317,
    programTitle: '포트폴리오 1주 완성 챌린지 35기',
    userId: 13305,
    userName: '안한나',
    userEmail: 'hanna@example.com',
    refundedAmount: 0,
    originalAmount: 0,
    orderId: 'letsMOCK5403',
    paymentKey: 'tviva20260721083000iiii',
    refundScope: 'FULL',
    refundSource: 'USER',
  },
];
