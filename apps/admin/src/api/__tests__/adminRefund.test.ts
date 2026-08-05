import { describe, expect, it } from 'vitest';
import { adminRefundHistorySchema, adminRefundLogSchema } from '../adminRefund';

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
