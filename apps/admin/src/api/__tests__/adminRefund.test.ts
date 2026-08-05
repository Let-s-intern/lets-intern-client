import { describe, expect, it } from 'vitest';
import {
  findRefundAmountMismatch,
  adminRefundHistorySchema,
  adminRefundLogSchema,
  adminRefundRequestSchema,
  userRefundHistorySchema,
  userRefundItemSchema,
} from '../adminRefund';

const successLog = {
  id: 1,
  refundedAt: '2026-08-03T15:00:00',
  programType: 'CHALLENGE',
  programId: 319,
  programTitle: '[스타트업 Ver.] 면접 준비 7일 끝장 챌린지 7기',
  userId: 13023,
  userName: '홍길동',
  userEmail: 'hong@example.com',
  managerName: '임호정',
  refundedAmount: 330000,
  reason: '프로그램 오결제',
  status: 'SUCCESS',
  failureMessage: null,
  applicationId: 14486,
  orderId: 'letsBX385104',
  paymentKey: 'tviva20260803150000abcd',
  originalAmount: 330000,
  paidAt: '2026-07-20T10:00:00',
  couponName: '하반기 멤버십 구매자 전용 쿠폰',
  couponDiscount: -1,
};

describe('adminRefundLogSchema', () => {
  it('정상 이력을 파싱한다', () => {
    const parsed = adminRefundLogSchema.parse(successLog);

    expect(parsed.managerName).toBe('임호정');
    expect(parsed.refundedAmount).toBe(330000);
    expect(parsed.applicationId).toBe(14486);
  });

  it('실패 이력의 PG 응답을 보존한다', () => {
    const parsed = adminRefundLogSchema.parse({
      ...successLog,
      status: 'FAILED',
      failureMessage: '이미 취소된 결제입니다.',
    });

    expect(parsed.status).toBe('FAILED');
    expect(parsed.failureMessage).toBe('이미 취소된 결제입니다.');
  });

  it('대상이 지워져 스냅샷만 남아도 파싱된다', () => {
    // 회원 탈퇴 시 신청서·결제가 cascade 로 지워질 수 있어 FK 가 끊길 수 있다.
    const parsed = adminRefundLogSchema.parse({
      ...successLog,
      userId: null,
      programId: null,
      applicationId: null,
    });

    expect(parsed.userName).toBe('홍길동');
    expect(parsed.programTitle).toContain('면접 준비');
  });

  it('알 수 없는 상태값은 거절한다', () => {
    expect(() =>
      adminRefundLogSchema.parse({ ...successLog, status: 'UNKNOWN' }),
    ).toThrow();
  });

  it('정산 대사에 쓰는 스냅샷을 보존한다', () => {
    // 스키마에 없는 필드는 zod 가 조용히 버린다. 삭제된 건은 이 로그가 유일한 근거라
    // 하나라도 빠지면 토스 콘솔과 맞춰볼 수 없다.
    const parsed = adminRefundLogSchema.parse(successLog);

    expect(parsed.orderId).toBe('letsBX385104');
    expect(parsed.paymentKey).toBe('tviva20260803150000abcd');
    expect(parsed.paidAt).toBe('2026-07-20T10:00:00');
    expect(parsed.couponName).toBe('하반기 멤버십 구매자 전용 쿠폰');
    expect(parsed.couponDiscount).toBe(-1);
  });

  it('부분 환불 건은 환불액과 원 결제액을 함께 보존한다', () => {
    const parsed = adminRefundLogSchema.parse({
      ...successLog,
      refundedAmount: 220000,
      originalAmount: 330000,
    });

    expect(parsed.refundedAmount).toBe(220000);
    expect(parsed.originalAmount).toBe(330000);
  });

  it('스냅샷 확장 이전 이력은 신규 필드 없이도 파싱된다', () => {
    // 과거 이력에는 확장 컬럼이 비어 있다. 필수로 두면 히스토리 전체가 깨진다.
    const {
      orderId: _orderId,
      paymentKey: _paymentKey,
      originalAmount: _originalAmount,
      paidAt: _paidAt,
      couponName: _couponName,
      couponDiscount: _couponDiscount,
      ...legacyLog
    } = successLog;

    expect(() => adminRefundLogSchema.parse(legacyLog)).not.toThrow();
  });
});

describe('adminRefundRequestSchema', () => {
  const validRequest = {
    managerName: '임호정',
    reason: '프로그램 오결제',
    sendNotification: true,
    refundAmount: 330000,
  };

  it('금액을 포함한 요청을 파싱한다', () => {
    expect(adminRefundRequestSchema.parse(validRequest).refundAmount).toBe(
      330000,
    );
  });

  it('금액이 없으면 전체 환불로 통과시킨다', () => {
    // 서버가 payment.finalPrice 를 쓴다. 실결제액이 0원인 건도 이 경로로만 취소된다.
    const { refundAmount: _refundAmount, ...fullRequest } = validRequest;

    const parsed = adminRefundRequestSchema.parse(fullRequest);

    expect(parsed).not.toHaveProperty('refundAmount');
  });

  it('0원 환불을 거절한다', () => {
    // TossProvider 가 cancelAmount 0 을 조용히 무시한다.
    // 성공 응답을 받고도 돈이 나가지 않은 상태가 된다.
    expect(() =>
      adminRefundRequestSchema.parse({ ...validRequest, refundAmount: 0 }),
    ).toThrow();
  });

  it('음수 환불을 거절한다', () => {
    expect(() =>
      adminRefundRequestSchema.parse({ ...validRequest, refundAmount: -1000 }),
    ).toThrow();
  });

  it('원 단위가 아닌 금액을 거절한다', () => {
    expect(() =>
      adminRefundRequestSchema.parse({ ...validRequest, refundAmount: 1000.5 }),
    ).toThrow();
  });

  it('담당자와 사유가 비면 거절한다', () => {
    expect(() =>
      adminRefundRequestSchema.parse({ ...validRequest, managerName: '' }),
    ).toThrow();
    expect(() =>
      adminRefundRequestSchema.parse({ ...validRequest, reason: '' }),
    ).toThrow();
  });
});

describe('adminRefundHistorySchema', () => {
  it('PageInfo 규약을 그대로 파싱한다', () => {
    const parsed = adminRefundHistorySchema.parse({
      refundLogList: [successLog],
      pageInfo: {
        pageNum: 0,
        pageSize: 20,
        totalElements: 1,
        totalPages: 1,
      },
    });

    expect(parsed.refundLogList).toHaveLength(1);
    expect(parsed.pageInfo.totalElements).toBe(1);
  });

  it('이력이 없어도 빈 목록으로 파싱된다', () => {
    const parsed = adminRefundHistorySchema.parse({
      refundLogList: [],
      pageInfo: { pageNum: 0, pageSize: 20, totalElements: 0, totalPages: 0 },
    });

    expect(parsed.refundLogList).toEqual([]);
  });
});

describe('userRefundItemSchema', () => {
  const userRefund = {
    applicationId: 14486,
    paymentId: 9001,
    refundedAt: '2026-08-01T09:12:00',
    paidAt: '2026-07-20T10:00:00',
    programType: 'CHALLENGE',
    programId: 319,
    programTitle: '[스타트업 Ver.] 면접 준비 7일 끝장 챌린지 7기',
    userId: 13023,
    userName: '홍길동',
    userEmail: 'hong@example.com',
    refundedAmount: 330000,
    originalAmount: 330000,
    orderId: 'letsBX385104',
    paymentKey: 'tviva20260720100000abcd',
    refundType: 'ALL',
    source: 'USER',
  };

  it('유저 환불 한 줄을 파싱한다', () => {
    const parsed = userRefundItemSchema.parse(userRefund);

    expect(parsed.refundType).toBe('ALL');
    expect(parsed.source).toBe('USER');
  });

  it('배치 자동환불은 처리경로로 구분된다', () => {
    // 유저가 직접 취소한 것이 아니다. 라벨만으로는 운영이 오독한다.
    const parsed = userRefundItemSchema.parse({
      ...userRefund,
      source: 'BATCH',
    });

    expect(parsed.source).toBe('BATCH');
  });

  it('처리경로가 없으면 거절한다', () => {
    // 환불 실행 시점에 반드시 기록되는 값이다. 비어 있다면 계약이 깨진 것이다.
    const { source: _source, ...withoutSource } = userRefund;

    expect(() => userRefundItemSchema.parse(withoutSource)).toThrow();
  });

  it('알 수 없는 처리경로는 거절한다', () => {
    expect(() =>
      userRefundItemSchema.parse({ ...userRefund, source: 'SQL' }),
    ).toThrow();
  });

  it('규정 비율이 없어도 파싱된다', () => {
    // 환불 시각·금액과 달리 규정 비율은 못 남기는 경로가 있을 수 있다. 표시만 비운다.
    const parsed = userRefundItemSchema.parse({
      ...userRefund,
      refundType: null,
    });

    expect(parsed.refundType).toBeNull();
  });

  it('탈퇴로 FK 가 끊겨도 스냅샷만으로 파싱된다', () => {
    const parsed = userRefundItemSchema.parse({
      ...userRefund,
      userId: null,
      applicationId: null,
      programId: null,
    });

    expect(parsed.userName).toBe('홍길동');
  });

  it('0원 결제 취소도 목록에 들어온다', () => {
    // 100% 할인 쿠폰과 어드민 테스트 참여. 금액이 0 이라 조건에서 빠지면 안 된다.
    const parsed = userRefundItemSchema.parse({
      ...userRefund,
      refundedAmount: 0,
      originalAmount: 0,
    });

    expect(parsed.refundedAmount).toBe(0);
  });
});

describe('userRefundHistorySchema', () => {
  it('refundList 와 pageInfo 를 파싱한다', () => {
    // 어드민 탭은 refundLogList, 유저 탭은 refundList 다. 키 이름이 다르다.
    const parsed = userRefundHistorySchema.parse({
      refundList: [],
      pageInfo: { pageNum: 0, pageSize: 20, totalElements: 0, totalPages: 0 },
    });

    expect(parsed.refundList).toEqual([]);
    expect(parsed.pageInfo.pageSize).toBe(20);
  });
});

describe('findRefundAmountMismatch', () => {
  it('요청 금액과 처리 금액이 같으면 어긋나지 않는다', () => {
    expect(findRefundAmountMismatch(35000, 35000)).toBeNull();
  });

  it('서버가 전액을 처리하면 어긋남을 알린다', () => {
    // 구버전 서버가 refundAmount 를 버리고 실결제액 전액을 환불한 경우다.
    const message = findRefundAmountMismatch(35000, 40000);

    expect(message).toContain('40,000원을 처리했습니다');
    expect(message).toContain('35,000원');
  });

  it('전액 환불은 대조하지 않는다', () => {
    // 금액을 보내지 않으면 서버가 실결제액을 쓴다. 클라이언트가 아는 값과 달라도 정상이다.
    expect(findRefundAmountMismatch(undefined, 40000)).toBeNull();
  });

  it('서버가 금액을 돌려주지 않으면 판단하지 않는다', () => {
    expect(findRefundAmountMismatch(35000, null)).toBeNull();
  });
});
