import type { AdminRefundLog } from '@/api/adminRefund';

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
 *
 * applicationId 5009 는 환불 후 삭제된 건이다. 참여자 행이 없어 목록에는 나타나지 않고
 * 히스토리에만 `삭제됨` 으로 남는다.
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
    isDeleted: false,
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
    isDeleted: false,
  },
  {
    // 환불 후 완전 삭제한 건. 참여자 행이 없어 목록에는 나타나지 않는다.
    id: 5,
    refundedAt: '2026-08-03T17:00:00',
    programType: 'CHALLENGE',
    programId: MOCK_REFUND_PROGRAM_ID,
    programTitle: '[스타트업 Ver.] 면접 준비 7일 끝장 챌린지 7기',
    userId: 13025,
    userName: '한삭제',
    userEmail: 'deleted@example.com',
    managerName: '송다예',
    refundedAmount: 330000,
    reason: '정책상 부분이나 유저가 전액을 요구 — 없던 일로 처리',
    status: 'SUCCESS',
    failureMessage: null,
    applicationId: 5009,
    orderId: 'letsMOCK5009',
    paymentKey: 'tviva20260720120000eeee',
    originalAmount: 330000,
    paidAt: '2026-07-20T12:00:00',
    couponName: null,
    couponDiscount: null,
    isDeleted: true,
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
    isDeleted: false,
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
    isDeleted: false,
  },
];
