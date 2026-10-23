import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';

import axios from '@/utils/axios';

import {
  useConfirmPlanUpgradeMutation,
  usePlanUpgradeQuery,
} from './planUpgrade';
import { planUpgradeSchema } from './planUpgradeSchema';

// application.ts 가 @letscareer/api(import.meta 사용)를 임포트 그래프로 물고 있어 모킹한다.
jest.mock('@letscareer/api', () => ({
  createDefaultAxios: jest.fn(() => ({})),
  createV2Axios: jest.fn(() => ({})),
  fetchJson: jest.fn(),
}));
jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}));
jest.mock('@/utils/axiosV2', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn() },
}));

const axiosGet = axios.get as jest.Mock;
const axiosPost = axios.post as jest.Mock;

function newClient() {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
}

function createWrapper(client: QueryClient) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryWrapper';
  return Wrapper;
}

const upgradable = {
  applicationId: 7,
  programId: 3,
  challengeTitle: '경험정리 챌린지 20기',
  currentPlan: {
    planType: 'BASIC',
    description: '미션 자료 제공',
    salePrice: 84000,
    paidAmount: 74000,
  },
  deadline: '2026-10-01T23:59:59',
  unavailableReason: null,
  options: [
    {
      planType: 'STANDARD',
      title: '스탠다드',
      description: '서면 피드백 포함',
      salePrice: 169000,
      additionalAmount: 85000,
      feedbackMissions: [
        {
          missionId: 11,
          th: 3,
          title: '경험분석',
          feedbackType: 'WRITTEN_FEEDBACK',
        },
      ],
    },
    {
      planType: 'PREMIUM',
      title: '프리미엄',
      description: 'Live 피드백 포함',
      salePrice: 249000,
      additionalAmount: 165000,
      feedbackMissions: [
        {
          missionId: 11,
          th: 3,
          title: '경험분석',
          feedbackType: 'WRITTEN_FEEDBACK',
        },
        {
          missionId: 12,
          th: 5,
          title: '자기소개서',
          feedbackType: 'LIVE_FEEDBACK',
        },
      ],
    },
  ],
};

const unavailable = (unavailableReason: string) => ({
  ...upgradable,
  currentPlan: { ...upgradable.currentPlan, planType: 'LIGHT' },
  unavailableReason,
  options: [],
});

const confirmBody = {
  toPlan: 'STANDARD' as const,
  paymentKey: 'tgen_payment_key',
  orderId: 'plan-upgrade-7-1760000000000',
  amount: 85000,
};

const confirmResponse = {
  applicationId: 7,
  programId: 3,
  fromPlan: 'BASIC',
  toPlan: 'STANDARD',
  additionalAmount: 85000,
  paidAt: '2026-09-20T10:00:00',
  receiptUrl: 'https://dashboard.tosspayments.com/receipt',
  method: '카드',
};

beforeEach(() => {
  axiosGet.mockReset();
  axiosPost.mockReset();
});

describe('planUpgradeSchema', () => {
  it('업그레이드 가능한 응답을 읽는다', () => {
    expect(planUpgradeSchema.parse(upgradable)).toEqual(upgradable);
  });

  it.each([
    'CANCELED',
    'PARTIALLY_REFUNDED',
    'LIGHT',
    'TOP_PLAN',
    'ALREADY_CHANGED',
    'DEADLINE_PASSED',
  ])('불가 사유 %s 를 읽는다', (unavailableReason) => {
    expect(
      planUpgradeSchema.parse(unavailable(unavailableReason)).unavailableReason,
    ).toBe(unavailableReason);
  });

  it('계약에 없는 사유는 거부한다', () => {
    expect(planUpgradeSchema.safeParse(unavailable('UNKNOWN')).success).toBe(
      false,
    );
  });
});

describe('usePlanUpgradeQuery', () => {
  it('신청 id 로 업그레이드 정보를 조회한다', async () => {
    axiosGet.mockResolvedValue({ data: { data: upgradable } });

    const { result } = renderHook(() => usePlanUpgradeQuery('7'), {
      wrapper: createWrapper(newClient()),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(axiosGet).toHaveBeenCalledWith('/plan-upgrade/7');
    expect(result.current.data?.options.map((o) => o.planType)).toEqual([
      'STANDARD',
      'PREMIUM',
    ]);
  });

  it('불가 사유가 있는 응답은 성공 상태로 사유를 준다', async () => {
    axiosGet.mockResolvedValue({ data: { data: unavailable('LIGHT') } });

    const { result } = renderHook(() => usePlanUpgradeQuery(7), {
      wrapper: createWrapper(newClient()),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.unavailableReason).toBe('LIGHT');
    expect(result.current.data?.options).toEqual([]);
  });

  it('알 수 없는 사유 값은 파싱에 실패해 조회 실패 상태가 된다', async () => {
    axiosGet.mockResolvedValue({ data: { data: unavailable('UNKNOWN') } });

    const { result } = renderHook(() => usePlanUpgradeQuery(7), {
      wrapper: createWrapper(newClient()),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useConfirmPlanUpgradeMutation', () => {
  it('결제 정보를 본문에 실어 승인 API 를 호출하고 응답을 읽는다', async () => {
    axiosPost.mockResolvedValue({ data: { data: confirmResponse } });

    const { result } = renderHook(() => useConfirmPlanUpgradeMutation('7'), {
      wrapper: createWrapper(newClient()),
    });

    result.current.mutate(confirmBody);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(axiosPost).toHaveBeenCalledWith(
      '/plan-upgrade/7/confirm',
      confirmBody,
    );
    expect(result.current.data).toEqual(confirmResponse);
  });

  it('성공하면 업그레이드 조회와 마이페이지 신청 목록을 무효화한다', async () => {
    axiosPost.mockResolvedValue({ data: { data: confirmResponse } });
    const client = newClient();
    const invalidateQueries = jest.spyOn(client, 'invalidateQueries');

    const { result } = renderHook(() => useConfirmPlanUpgradeMutation('7'), {
      wrapper: createWrapper(client),
    });

    result.current.mutate(confirmBody);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(
      invalidateQueries.mock.calls.map(([filters]) => filters?.queryKey),
    ).toEqual([['usePlanUpgradeQueryKey'], ['useMypageApplicationsQueryKey']]);
  });

  it('실패하면 무효화하지 않는다', async () => {
    axiosPost.mockRejectedValue(new Error('플랜 업그레이드 처리 실패'));
    const client = newClient();
    const invalidateQueries = jest.spyOn(client, 'invalidateQueries');

    const { result } = renderHook(() => useConfirmPlanUpgradeMutation('7'), {
      wrapper: createWrapper(client),
    });

    result.current.mutate(confirmBody);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(invalidateQueries).not.toHaveBeenCalled();
  });
});
