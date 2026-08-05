import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import {
  adminRefundHistorySchema,
  userRefundHistorySchema,
} from '@/api/adminRefund';
import { challengeApplicationsSchema } from '@/schema';

import { adminParticipantHandlers, adminRefundHandlers } from './adminRefund';

const BASE = 'http://localhost/api/v1';
const server = setupServer(...adminRefundHandlers, ...adminParticipantHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const refund = (applicationId: number, body: Record<string, unknown>) =>
  fetch(`${BASE}/admin/application/${applicationId}/refund`, {
    method: 'POST',
    body: JSON.stringify({
      managerName: '임호정',
      reason: '프로그램 오결제',
      sendNotification: true,
      ...body,
    }),
  });

describe('POST /admin/application/:applicationId/refund', () => {
  it('금액을 받아 그대로 환불한다', async () => {
    const res = await refund(5001, { refundAmount: 220000 });
    const body = (await res.json()) as { data: { refundedAmount: number } };

    expect(res.status).toBe(200);
    expect(body.data.refundedAmount).toBe(220000);
  });

  it('금액이 없으면 실결제액 전액을 환불한다', async () => {
    const res = await refund(5009, {});
    const body = (await res.json()) as { data: { refundedAmount: number } };

    expect(res.status).toBe(200);
    expect(body.data.refundedAmount).toBe(330000);
  });

  it('0원 결제도 금액 없이 취소된다', async () => {
    // LC-3191 동작. PG 호출 없이 참여만 취소되고 환불액 0 이 기록된다.
    // 100% 할인 쿠폰(5002)과 어드민 테스트 참여(5006) 둘 다 이 경로다.
    const res = await refund(5002, {});
    const body = (await res.json()) as { data: { refundedAmount: number } };

    expect(res.status).toBe(200);
    expect(body.data.refundedAmount).toBe(0);
  });

  it('0원 결제에 금액을 지정하면 거절한다', async () => {
    // 0 은 양수 조건에, 1 은 상한 조건에 걸린다. 통과 가능한 값이 없다.
    expect((await refund(5006, { refundAmount: 0 })).status).toBe(400);
    expect((await refund(5006, { refundAmount: 1 })).status).toBe(400);
  });

  it('실결제액을 넘는 금액을 거절한다', async () => {
    // 화면에서도 막지만 금액이 요청 바디에 있어 조작할 수 있다.
    // 금액 검증이 먼저라 이 요청은 결제 행을 건드리지 않는다.
    const res = await refund(5004, { refundAmount: 330001 });

    expect(res.status).toBe(400);
  });

  it('실결제액과 같은 금액을 거절한다', async () => {
    // 전액이면 금액 없이 요청해야 한다. 초과와 구제책이 달라 메시지를 따로 준다.
    const res = await refund(5004, { refundAmount: 330000 });
    const body = (await res.json()) as { message: string };

    expect(res.status).toBe(400);
    expect(body.message).toContain('전액 환불로 요청해주세요');
  });

  it('이미 환불된 건은 409 로 거절한다', async () => {
    const res = await refund(5003, {});

    expect(res.status).toBe(409);
  });
});

describe('GET /admin/refund-history', () => {
  it('부분 환불 건이 원 결제액과 함께 내려온다', async () => {
    const res = await fetch(`${BASE}/admin/refund-history?programId=319`);
    const body = (await res.json()) as { data: unknown };
    const parsed = adminRefundHistorySchema.parse(body.data);

    const partial = parsed.refundLogList.find(
      (log) => log.applicationId === 5008,
    );

    expect(partial?.refundedAmount).toBe(220000);
    expect(partial?.originalAmount).toBe(330000);
  });

  it('정산 대사에 쓰는 주문번호가 비어 있지 않다', async () => {
    // 하드 삭제하면 원본이 사라져 이 값이 유일한 대사 기준이 된다.
    const res = await fetch(`${BASE}/admin/refund-history`);
    const body = (await res.json()) as { data: unknown };
    const parsed = adminRefundHistorySchema.parse(body.data);

    parsed.refundLogList.forEach((log) => {
      expect(log.orderId).toBeTruthy();
    });
  });
});

describe('GET /admin/refund-history/user', () => {
  const fetchUserRefunds = async (query = '') => {
    const res = await fetch(`${BASE}/admin/refund-history/user${query}`);
    const body = (await res.json()) as { data: unknown };
    return userRefundHistorySchema.parse(body.data);
  };

  it('처리경로 두 갈래가 한 목록에 보인다', async () => {
    const parsed = await fetchUserRefunds();
    const sources = parsed.refundList.map((refund) => refund.refundSource);

    expect(sources).toContain('USER');
    expect(sources).toContain('SQL');
  });

  it('환불 범위 두 갈래가 한 목록에 보인다', async () => {
    const parsed = await fetchUserRefunds();
    const scopes = parsed.refundList.map((refund) => refund.refundScope);

    expect(scopes).toContain('FULL');
    expect(scopes).toContain('PARTIAL');
  });

  it('0원 결제 취소도 목록에 남는다', async () => {
    // originalPrice > 0 을 조건에 넣으면 이 행이 통째로 사라진다.
    const parsed = await fetchUserRefunds();

    expect(
      parsed.refundList.some((refund) => refund.applicationId === 5403),
    ).toBe(true);
  });

  it('어드민 환불을 실행한 건은 유저 목록에서 빠진다', async () => {
    // 위 refund 테스트가 5001 을 어드민 환불로 만들었다. 5003·5008 은 시드 로그에 있다.
    const parsed = await fetchUserRefunds();
    const ids = parsed.refundList.map((refund) => refund.applicationId);

    expect(ids).not.toContain(5003);
    expect(ids).not.toContain(5008);
  });

  it('참여자 키워드로 거른다', async () => {
    const parsed = await fetchUserRefunds('?keyword=오세훈');

    expect(parsed.refundList).toHaveLength(1);
    expect(parsed.pageInfo.totalElements).toBe(1);
  });
});

describe('GET /challenge/:challengeId/applications', () => {
  it('환불여부 라벨 다섯 갈래를 모두 담고 있다', async () => {
    const res = await fetch(`${BASE}/challenge/319/applications`);
    const body = (await res.json()) as { data: unknown };
    const parsed = challengeApplicationsSchema.parse(body.data);

    const ids = parsed.applicationList.map((item) => item.application.id);

    // 5003 어드민 전체 / 5008 어드민 부분 / 5004 유저 전체 / 5005 유저 부분 / 5001 미환불
    expect(ids).toEqual(expect.arrayContaining([5001, 5003, 5004, 5005, 5008]));
  });
});
