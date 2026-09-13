import { ApiError } from '@letscareer/api';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { challengeApplicationsSchema } from '@/schema';

import {
  manualRefundRequestSchema,
  planChangeHistorySchema,
  planChangeInfoSchema,
  planChangeLogSchema,
  planChangeRequestSchema,
  planChangeResultSchema,
  useManualRefundCompleteMutation,
  usePlanChangeHistoryQuery,
  usePlanChangeMutation,
} from '../planChange';

const { get, patch } = vi.hoisted(() => ({ get: vi.fn(), patch: vi.fn() }));

vi.mock('@/utils/axios', () => ({ default: { get, patch } }));

/** 운영이 계좌이체로 받고 금액을 고친 건. 결제 키가 없어 별도 환불 대상이다 */
const adminLog = {
  planChangeLogId: 7,
  applicationId: 14486,
  programId: 319,
  programTitle: '[스타트업 Ver.] 면접 준비 7일 끝장 챌린지 7기',
  userName: '홍길동',
  userEmail: 'hong@example.com',
  fromPlan: 'BASIC',
  toPlan: 'PREMIUM',
  calculatedAmount: 50000,
  additionalAmount: 45000,
  hasPaymentKey: false,
  changedBy: '임호정',
  reason: '9/12 계좌이체 입금 확인',
  paidAt: null,
  manualRefundedAt: null,
  manualRefundedBy: null,
  createDate: '2026-09-12T15:00:00',
};

const changeBody = {
  toPlan: 'PREMIUM',
  additionalAmount: null,
  managerName: '임호정',
  reason: '9/12 계좌이체 입금 확인',
} as const;

const setup = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const invalidate = vi.spyOn(client, 'invalidateQueries');
  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client }, children);
  const invalidatedKeys = () =>
    invalidate.mock.calls.map(([filters]) => filters?.queryKey);
  return { wrapper, invalidatedKeys };
};

afterEach(() => {
  get.mockReset();
  patch.mockReset();
});

describe('planChangeLogSchema', () => {
  it('운영진 변경 로그를 파싱한다', () => {
    const parsed = planChangeLogSchema.parse(adminLog);

    expect(parsed.calculatedAmount).toBe(50000);
    expect(parsed.additionalAmount).toBe(45000);
    expect(parsed.hasPaymentKey).toBe(false);
    expect(parsed.changedBy).toBe('임호정');
  });

  it('수동 환불 완료 기록을 읽는다', () => {
    const parsed = planChangeLogSchema.parse({
      ...adminLog,
      manualRefundedAt: '2026-09-13T10:00:00',
      manualRefundedBy: '임호정',
    });

    expect(parsed.manualRefundedAt).toBe('2026-09-13T10:00:00');
    expect(parsed.manualRefundedBy).toBe('임호정');
  });

  it('대상이 지워져 스냅샷 필드가 비어도 파싱된다', () => {
    const parsed = planChangeLogSchema.parse({
      planChangeLogId: 8,
      fromPlan: 'STANDARD',
      toPlan: 'PREMIUM',
      calculatedAmount: 30000,
      additionalAmount: 30000,
      hasPaymentKey: true,
      applicationId: null,
      programId: null,
    });

    expect(parsed.applicationId).toBeNull();
    expect(parsed.changedBy).toBeUndefined();
  });

  it('플랜 enum 밖의 값은 거부한다', () => {
    expect(() =>
      planChangeLogSchema.parse({ ...adminLog, toPlan: 'GOLD' }),
    ).toThrow();
  });
});

describe('planChangeInfoSchema', () => {
  it('현재 플랜·상위 플랜 선택지·로그를 파싱한다', () => {
    const parsed = planChangeInfoSchema.parse({
      currentPlan: 'BASIC',
      options: [
        {
          planType: 'STANDARD',
          title: '스탠다드',
          salePrice: 150000,
          calculatedAmount: 30000,
        },
        {
          planType: 'PREMIUM',
          title: '프리미엄',
          salePrice: 170000,
          calculatedAmount: 50000,
        },
      ],
      logs: [adminLog],
    });

    expect(parsed.currentPlan).toBe('BASIC');
    expect(parsed.options.map((option) => option.planType)).toEqual([
      'STANDARD',
      'PREMIUM',
    ]);
    expect(parsed.logs).toHaveLength(1);
  });

  it('바꿀 수 있는 플랜이 없으면 빈 선택지로 읽는다', () => {
    const parsed = planChangeInfoSchema.parse({
      currentPlan: 'PREMIUM',
      options: [],
      logs: [],
    });

    expect(parsed.options).toEqual([]);
  });
});

describe('planChangeRequestSchema', () => {
  it('금액 null 은 서버 계산값을 쓰라는 요청이다', () => {
    expect(planChangeRequestSchema.parse(changeBody).additionalAmount).toBe(
      null,
    );
  });

  it('0원 수납은 허용한다', () => {
    expect(
      planChangeRequestSchema.parse({ ...changeBody, additionalAmount: 0 })
        .additionalAmount,
    ).toBe(0);
  });

  it('음수·소수 금액을 거부한다', () => {
    expect(() =>
      planChangeRequestSchema.parse({ ...changeBody, additionalAmount: -1 }),
    ).toThrow();
    expect(() =>
      planChangeRequestSchema.parse({ ...changeBody, additionalAmount: 0.5 }),
    ).toThrow();
  });

  it('담당자 이름과 사유가 비면 거부한다', () => {
    expect(() =>
      planChangeRequestSchema.parse({ ...changeBody, managerName: '' }),
    ).toThrow();
    expect(() =>
      planChangeRequestSchema.parse({ ...changeBody, reason: '' }),
    ).toThrow();
  });
});

describe('planChangeResultSchema', () => {
  it('변경 결과를 파싱한다', () => {
    const parsed = planChangeResultSchema.parse({
      planChangeLogId: 7,
      fromPlan: 'BASIC',
      toPlan: 'PREMIUM',
      calculatedAmount: 50000,
      additionalAmount: 50000,
    });

    expect(parsed.toPlan).toBe('PREMIUM');
  });
});

describe('planChangeHistorySchema', () => {
  it('로그 목록과 페이지 정보를 파싱한다', () => {
    const parsed = planChangeHistorySchema.parse({
      planChangeLogList: [adminLog],
      pageInfo: { pageNum: 0, pageSize: 20, totalElements: 1, totalPages: 1 },
    });

    expect(parsed.planChangeLogList[0].planChangeLogId).toBe(7);
    expect(parsed.pageInfo.totalElements).toBe(1);
  });
});

describe('manualRefundRequestSchema', () => {
  it('담당자 이름이 비면 거부한다', () => {
    expect(() =>
      manualRefundRequestSchema.parse({ managerName: '' }),
    ).toThrow();
  });
});

describe('참여자 응답의 플랜 변경 금액', () => {
  it('필드가 없는 응답은 0 으로 읽는다', () => {
    const { applicationList } = challengeApplicationsSchema.parse({
      applicationList: [{ application: { id: 1 } }],
    });

    expect(applicationList[0].application).toMatchObject({
      additionalPaidAmount: 0,
      pendingManualRefundAmount: 0,
    });
  });

  it('null 도 0 으로 읽는다', () => {
    const { applicationList } = challengeApplicationsSchema.parse({
      applicationList: [
        {
          application: {
            id: 1,
            additionalPaidAmount: null,
            pendingManualRefundAmount: null,
          },
        },
      ],
    });

    expect(applicationList[0].application).toMatchObject({
      additionalPaidAmount: 0,
      pendingManualRefundAmount: 0,
    });
  });

  it('필드가 있는 응답은 값을 그대로 읽는다', () => {
    const { applicationList } = challengeApplicationsSchema.parse({
      applicationList: [
        {
          application: {
            id: 1,
            additionalPaidAmount: 50000,
            pendingManualRefundAmount: 45000,
          },
        },
      ],
    });

    expect(applicationList[0].application).toMatchObject({
      additionalPaidAmount: 50000,
      pendingManualRefundAmount: 45000,
    });
  });
});

describe('usePlanChangeMutation', () => {
  it('요청을 보내고 참여자·히스토리·조회 쿼리를 무효화한다', async () => {
    const result = {
      planChangeLogId: 7,
      fromPlan: 'BASIC',
      toPlan: 'PREMIUM',
      calculatedAmount: 50000,
      additionalAmount: 50000,
    };
    patch.mockResolvedValue({ data: { data: result } });
    const onSuccess = vi.fn();
    const { wrapper, invalidatedKeys } = setup();

    const { result: hook } = renderHook(
      () => usePlanChangeMutation({ challengeId: '319', onSuccess }),
      { wrapper },
    );
    await act(() =>
      hook.current.mutateAsync({ applicationId: 14486, body: changeBody }),
    );

    expect(patch).toHaveBeenCalledWith(
      '/admin/application/14486/plan',
      changeBody,
    );
    expect(invalidatedKeys()).toEqual([
      ['admin', 'challenge', '319', 'participants'],
      ['adminPlanChangeHistory'],
      ['adminPlanChange'],
    ]);
    expect(onSuccess).toHaveBeenCalledWith(result);
  });

  it('담당자 이름이 비면 요청하지 않는다', async () => {
    const onError = vi.fn();
    const { wrapper } = setup();

    const { result: hook } = renderHook(
      () => usePlanChangeMutation({ challengeId: '319', onError }),
      { wrapper },
    );
    act(() =>
      hook.current.mutate({
        applicationId: 14486,
        body: { ...changeBody, managerName: '' },
      }),
    );

    await waitFor(() => expect(onError).toHaveBeenCalled());
    expect(patch).not.toHaveBeenCalled();
  });

  it('실패하면 서버 문구를 넘긴다', async () => {
    patch.mockRejectedValue(
      new ApiError({
        code: 'PLAN_CHANGE_NOT_ALLOWED_LIGHT',
        message: '라이트 플랜은 변경할 수 없습니다.',
        status: 400,
        endpoint: '/admin/application/14486/plan',
        method: 'PATCH',
      }),
    );
    const onError = vi.fn();
    const { wrapper, invalidatedKeys } = setup();

    const { result: hook } = renderHook(
      () => usePlanChangeMutation({ challengeId: '319', onError }),
      { wrapper },
    );
    act(() => hook.current.mutate({ applicationId: 14486, body: changeBody }));

    await waitFor(() =>
      expect(onError).toHaveBeenCalledWith('라이트 플랜은 변경할 수 없습니다.'),
    );
    expect(invalidatedKeys()).toEqual([]);
  });
});

describe('useManualRefundCompleteMutation', () => {
  it('요청을 보내고 로그의 챌린지 참여자·히스토리·조회 쿼리를 무효화한다', async () => {
    patch.mockResolvedValue({ data: { data: null } });
    const onSuccess = vi.fn();
    const { wrapper, invalidatedKeys } = setup();

    const { result: hook } = renderHook(
      () => useManualRefundCompleteMutation({ onSuccess }),
      { wrapper },
    );
    await act(() =>
      hook.current.mutateAsync({
        planChangeLogId: 7,
        challengeId: 319,
        body: { managerName: '임호정' },
      }),
    );

    expect(patch).toHaveBeenCalledWith(
      '/admin/plan-change-log/7/manual-refund',
      { managerName: '임호정' },
    );
    // 참여자 표는 라우트 파라미터 문자열을 키로 쓴다
    expect(invalidatedKeys()).toEqual([
      ['admin', 'challenge', '319', 'participants'],
      ['adminPlanChangeHistory'],
      ['adminPlanChange'],
    ]);
    expect(onSuccess).toHaveBeenCalled();
  });

  it('로그에 챌린지가 없으면 참여자 쿼리는 건너뛴다', async () => {
    patch.mockResolvedValue({ data: { data: null } });
    const { wrapper, invalidatedKeys } = setup();

    const { result: hook } = renderHook(
      () => useManualRefundCompleteMutation(),
      { wrapper },
    );
    await act(() =>
      hook.current.mutateAsync({
        planChangeLogId: 7,
        challengeId: null,
        body: { managerName: '임호정' },
      }),
    );

    expect(invalidatedKeys()).toEqual([
      ['adminPlanChangeHistory'],
      ['adminPlanChange'],
    ]);
  });
});

describe('usePlanChangeHistoryQuery', () => {
  it('필터와 페이지를 쿼리 파라미터로 보낸다', async () => {
    get.mockResolvedValue({
      data: {
        data: {
          planChangeLogList: [adminLog],
          pageInfo: {
            pageNum: 0,
            pageSize: 20,
            totalElements: 1,
            totalPages: 1,
          },
        },
      },
    });
    const params = { page: 0, size: 20, pendingManualRefundOnly: true };
    const { wrapper } = setup();

    const { result } = renderHook(() => usePlanChangeHistoryQuery(params), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(get).toHaveBeenCalledWith('/admin/plan-change-history', { params });
    expect(result.current.data?.planChangeLogList).toHaveLength(1);
  });
});
