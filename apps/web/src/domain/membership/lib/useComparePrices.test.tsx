/**
 * @jest-environment jsdom
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import type { CompareCombo } from '../data/compare';

// 실제 2단 조회(active → detail)를 그대로 태우고 네트워크만 막는다.
// 훅이 어느 엔드포인트를 어떤 인자로 부르는지까지 이 목이 검증한다.
const get = jest.fn();
jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: {
    get: (url: string, config?: unknown) => get(url, config),
  },
}));

// 올인원 특가는 Push 2 의 훅이 준다. 여기서는 역전 판정 입력값으로만 쓴다.
const membershipData = jest.fn();
jest.mock('./useMembershipChallengeData', () => ({
  useMembershipChallengeData: () => membershipData(),
}));

import { useComparePrices } from './useComparePrices';

const combo: CompareCombo = {
  id: 'test-combo',
  label: '대기업 자소서 + 인적성',
  items: [
    {
      challengeType: 'PERSONAL_STATEMENT_LARGE_CORP',
      name: '대기업 자기소개서 챌린지',
    },
    { challengeType: 'ETC', name: '인적성 챌린지' },
  ],
};

/** /challenge/{id} 응답 — 가격 산출에 필요한 최소 형태 */
const challengeDetail = (price: number, discount: number) => ({
  data: {
    data: {
      challengeType: 'ETC',
      classificationInfo: [{ programClassification: 'CAREER_SEARCH' }],
      faqInfo: [],
      priceInfo: [
        {
          priceId: 1,
          price,
          refund: 0,
          discount,
          challengePricePlanType: 'BASIC',
          challengeOptionList: [],
        },
      ],
    },
  },
});

/** /challenge/active 응답 */
const activeList = (id: number | null) => ({
  data: {
    data: {
      challengeList:
        id === null
          ? []
          : [
              {
                id,
                title: '테스트 챌린지',
                beginning: '2026-06-01T00:00:00',
                deadline: '2026-06-30T00:00:00',
                startDate: '2026-07-01T00:00:00',
                endDate: '2026-09-30T00:00:00',
              },
            ],
    },
  },
});

/** 타입별 모집중 id, id별 (정가, 할인) 을 받아 axios.get 목을 세운다 */
const mockServer = (
  activeByType: Record<string, number | null>,
  detailById: Record<number, [number, number]>,
) => {
  get.mockImplementation(
    (url: string, config?: { params?: { type?: string } }) => {
      if (url === '/challenge/active') {
        const type = config?.params?.type ?? '';
        return Promise.resolve(activeList(activeByType[type]));
      }
      const id = Number(url.replace('/challenge/', ''));
      const [price, discount] = detailById[id] ?? [0, 0];
      return Promise.resolve(challengeDetail(price, discount));
    },
  );
};

const wrapper = ({ children }: PropsWithChildren) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

describe('useComparePrices', () => {
  beforeEach(() => {
    get.mockReset();
    membershipData.mockReturnValue({ salePrice: 169900 });
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.warn as jest.Mock).mockRestore();
  });

  it('두 챌린지의 현재 할인가를 합산한다 (정가 - 할인금액)', async () => {
    mockServer(
      { PERSONAL_STATEMENT_LARGE_CORP: 10, ETC: 20 },
      { 10: [160000, 16800], 20: [88000, 26200] },
    );

    const { result } = renderHook(() => useComparePrices(combo), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.items.map((i) => i.price)).toEqual([143200, 61800]);
    expect(result.current.total).toBe(205000);
  });

  it('모집 중인 기수가 없으면 그 항목은 price 가 null 이고 합계에서 빠진다', async () => {
    mockServer(
      { PERSONAL_STATEMENT_LARGE_CORP: 10, ETC: null },
      { 10: [160000, 16800] },
    );

    const { result } = renderHook(() => useComparePrices(combo), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.items[1].price).toBeNull();
    expect(result.current.total).toBe(143200);
    // 목록이 빈 타입은 상세를 부르지 않는다
    expect(get).not.toHaveBeenCalledWith('/challenge/0', undefined);
  });

  it('개별 합계가 올인원 특가 이하면 isInverted 가 true 이고 경고를 남긴다', async () => {
    // 합계 150,000 <= 특가 169,900
    mockServer(
      { PERSONAL_STATEMENT_LARGE_CORP: 10, ETC: 20 },
      { 10: [100000, 20000] /* 80,000 */, 20: [80000, 10000] /* 70,000 */ },
    );

    const { result } = renderHook(() => useComparePrices(combo), { wrapper });

    await waitFor(() => expect(result.current.isInverted).toBe(true));
    expect(result.current.total).toBe(150000);
    expect(console.warn).toHaveBeenCalledWith(
      '[LC-3219] 개별 합계가 올인원가보다 낮다',
      expect.objectContaining({ comboId: 'test-combo', total: 150000 }),
    );
  });

  it('합계가 올인원 특가보다 크면 isInverted 가 false 다', async () => {
    mockServer(
      { PERSONAL_STATEMENT_LARGE_CORP: 10, ETC: 20 },
      { 10: [160000, 16800], 20: [88000, 26200] },
    );

    const { result } = renderHook(() => useComparePrices(combo), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isInverted).toBe(false);
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('로딩 중에는 isLoading 이 true 이고 역전으로 오판하지 않는다', async () => {
    // 합계가 0 인 동안 역전(0 <= 169,900)으로 잡혀 탭이 사라지면 안 된다.
    get.mockImplementation(() => new Promise(() => {}));

    const { result } = renderHook(() => useComparePrices(combo), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isInverted).toBe(false);
    expect(result.current.items.every((i) => i.price === null)).toBe(true);
  });

  it('enabled 가 false 면 아무것도 조회하지 않고 로딩도 아니다', async () => {
    // 비활성 탭과 뷰포트 진입 전에 해당한다.
    mockServer({ PERSONAL_STATEMENT_LARGE_CORP: 10, ETC: 20 }, { 10: [1, 0] });

    const { result } = renderHook(
      () => useComparePrices(combo, { enabled: false }),
      { wrapper },
    );

    expect(get).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.total).toBe(0);
  });

  it('타입마다 /challenge/active 를 한 번씩만 부른다', async () => {
    mockServer(
      { PERSONAL_STATEMENT_LARGE_CORP: 10, ETC: 20 },
      { 10: [160000, 16800], 20: [88000, 26200] },
    );

    const { result } = renderHook(() => useComparePrices(combo), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    const activeCalls = get.mock.calls.filter(
      ([url]) => url === '/challenge/active',
    );
    expect(activeCalls).toHaveLength(2);
    expect(
      get.mock.calls.filter(([url]) => url.startsWith('/challenge/')).length,
    ).toBe(4);
  });

  it('항목 중 가격을 못 구한 게 있으면 쓸 수 없다고 본다', async () => {
    // 한쪽만 모집 중이면 합계가 실제보다 작게 잡힌다. 그 상태로 "개별 구매 시 N원" 을
    // 그리면 화면이 사실과 다른 금액을 말하게 되므로 탭을 아예 내린다.
    membershipData.mockReturnValue({ salePrice: 10000 });
    mockServer(
      { PERSONAL_STATEMENT_LARGE_CORP: 1, ETC: null },
      { 1: [89000, 30000] },
    );

    const { result } = renderHook(() => useComparePrices(combo), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.total).toBe(59000);
    expect(result.current.isInverted).toBe(false); // 59,000 > 10,000 이라 역전은 아니다
    expect(result.current.isUsable).toBe(false); // 그래도 합계를 믿을 수 없다
  });

  it('가격을 하나도 못 구하면 0원을 그리지 않고 탭을 내린다', async () => {
    // total 이 0 이면 isInverted 로도 안 걸린다 — "0개 개별 구매 시 0원" 이 그대로 남는다.
    membershipData.mockReturnValue({ salePrice: 169900 });
    mockServer({ PERSONAL_STATEMENT_LARGE_CORP: null, ETC: null }, {});

    const { result } = renderHook(() => useComparePrices(combo), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.total).toBe(0);
    expect(result.current.isInverted).toBe(false);
    expect(result.current.isUsable).toBe(false);
  });
});
