import { describe, expect, it } from 'vitest';
import {
  adminRefundHistorySchema,
  adminRefundLogSchema,
  adminRefundRequestSchema,
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

  it('삭제된 건은 isDeleted 로 남는다', () => {
    // 원본 행이 사라져 히스토리가 유일한 흔적이 된다.
    const parsed = adminRefundLogSchema.parse({
      ...successLog,
      isDeleted: true,
    });

    expect(parsed.isDeleted).toBe(true);
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

  it('hardDelete 를 생략하면 false 로 채운다', () => {
    // 삭제는 명시적으로 켰을 때만 일어나야 한다.
    expect(adminRefundRequestSchema.parse(validRequest).hardDelete).toBe(false);
  });

  it('hardDelete 를 켠 요청을 그대로 보낸다', () => {
    expect(
      adminRefundRequestSchema.parse({ ...validRequest, hardDelete: true })
        .hardDelete,
    ).toBe(true);
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
