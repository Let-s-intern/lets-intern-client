import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { adminRefundHistorySchema } from '@/api/adminRefund';
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

  it('0원 환불을 거절한다', async () => {
    const res = await refund(5006, { refundAmount: 0 });

    expect(res.status).toBe(400);
  });

  it('실결제액을 넘는 금액을 거절한다', async () => {
    // 화면에서도 막지만 금액이 요청 바디에 있어 조작할 수 있다.
    const res = await refund(5006, { refundAmount: 330001 });

    expect(res.status).toBe(400);
  });

  it('이미 환불된 건은 409 로 거절한다', async () => {
    const res = await refund(5003, { refundAmount: 330000 });

    expect(res.status).toBe(409);
  });

  it('hardDelete 를 켜면 참여자 행이 사라지고 이력에만 남는다', async () => {
    const res = await refund(5006, { refundAmount: 330000, hardDelete: true });
    expect(res.status).toBe(200);

    const listRes = await fetch(`${BASE}/challenge/319/applications`);
    const listBody = (await listRes.json()) as { data: unknown };
    const list = challengeApplicationsSchema.parse(listBody.data);
    expect(
      list.applicationList.map((item) => item.application.id),
    ).not.toContain(5006);

    const historyRes = await fetch(`${BASE}/admin/refund-history`);
    const historyBody = (await historyRes.json()) as { data: unknown };
    const history = adminRefundHistorySchema.parse(historyBody.data);
    expect(
      history.refundLogList.find((log) => log.applicationId === 5006)
        ?.isDeleted,
    ).toBe(true);
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

  it('삭제된 건은 참여자 행 없이 이력으로만 남는다', async () => {
    const res = await fetch(`${BASE}/admin/refund-history?programId=319`);
    const body = (await res.json()) as { data: unknown };
    const parsed = adminRefundHistorySchema.parse(body.data);

    const deleted = parsed.refundLogList.find(
      (log) => log.applicationId === 5009,
    );

    expect(deleted?.isDeleted).toBe(true);
    expect(deleted?.orderId).toBe('letsMOCK5009');
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
