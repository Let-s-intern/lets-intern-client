import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import axios from '@/utils/axios';

import {
  LIVE_MENTORING_SETTINGS_QUERY_KEY,
  LIVE_MENTORING_TEMPLATE_QUERY_KEY,
  useLiveMentoringOpenStatusQuery,
  useLiveMentoringSettingsQuery,
  useLiveMentoringSettlementQuery,
  useLiveMentoringTemplateQuery,
  useUpdateLiveMentoringSettingsMutation,
  useUpdateLiveMentoringTemplateMutation,
} from '../liveMentoring';
import {
  liveMentoringSettingsSchema,
  openStatusRowSchema,
  settlementRowSchema,
} from '../liveMentoringSchema';

// axios 모듈 자체를 모킹 (default export)
vi.mock('@/utils/axios', () => ({
  default: { get: vi.fn(), put: vi.fn() },
}));

const axiosMock = vi.mocked(axios, true);

function makeSettings(overrides: Record<string, unknown> = {}) {
  return {
    profileVisible: true,
    mosaicEnabled: false,
    mosaicBlur: 0,
    nickname: '자소서장인',
    profileImage: null,
    introduction: '소개',
    careers: [
      {
        company: '네이버',
        position: '기획',
        period: '2019-2026',
        visible: true,
      },
    ],
    categories: ['PERSONAL_STATEMENT'],
    durations: [50],
    feedbackStartDate: '2026-07-14',
    feedbackEndDate: '2026-07-28',
    ...overrides,
  };
}

function makeTemplate(overrides: Record<string, unknown> = {}) {
  return {
    category: 'RESUME',
    faq: [{ q: 'q', a: 'a' }],
    process: [{ step: 1, title: 't', desc: 'd' }],
    submissionSpec: { title: 't', desc: 'd' },
    introduction: '소개',
    careers: [],
    mentoringPoints: 'p',
    reviews: { visible: true, selectedReviewIds: [1] },
    checklist: [{ id: 1, label: 'x', mode: 'SHOWN' }],
    ...overrides,
  };
}

function createWrapper(client: QueryClient) {
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

function newClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

beforeEach(() => {
  axiosMock.get.mockReset();
  axiosMock.put.mockReset();
});

afterEach(() => {
  vi.clearAllMocks();
});

// ── 스키마 parse ──────────────────────────────────────────────
describe('스키마 parse', () => {
  it('유효한 설정을 파싱한다', () => {
    expect(() =>
      liveMentoringSettingsSchema.parse(makeSettings()),
    ).not.toThrow();
  });

  it('durations에 30/50이 아닌 값이 있으면 파싱 실패', () => {
    expect(() =>
      liveMentoringSettingsSchema.parse(makeSettings({ durations: [40] })),
    ).toThrow();
  });

  it('정산행 status가 enum 밖이면 파싱 실패', () => {
    expect(() =>
      settlementRowSchema.parse({
        period: '2026-06',
        completedCount: 1,
        grossAmount: 1000,
        status: 'DONE',
      }),
    ).toThrow();
  });

  it('오픈현황행 status가 enum 밖이면 파싱 실패', () => {
    expect(() =>
      openStatusRowSchema.parse({
        categories: ['RESUME'],
        durations: [30],
        price: 35000,
        feedbackStartDate: '2026-07-10',
        feedbackEndDate: '2026-07-23',
        status: 'PAUSED',
        reservationCount: 0,
      }),
    ).toThrow();
  });
});

// ── query 훅 ──────────────────────────────────────────────────
describe('useLiveMentoringSettingsQuery', () => {
  it('GET settings 를 호출하고 파싱해 반환한다', async () => {
    axiosMock.get.mockResolvedValue({ data: { data: makeSettings() } });

    const { result } = renderHook(() => useLiveMentoringSettingsQuery(), {
      wrapper: createWrapper(newClient()),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(axiosMock.get).toHaveBeenCalledWith(
      '/mentor/live-mentoring/settings',
    );
    expect(result.current.data?.categories).toEqual(['PERSONAL_STATEMENT']);
  });

  it('응답 스키마가 깨지면 isError 가 된다', async () => {
    axiosMock.get.mockResolvedValue({
      data: { data: makeSettings({ durations: [40] }) },
    });

    const { result } = renderHook(() => useLiveMentoringSettingsQuery(), {
      wrapper: createWrapper(newClient()),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useLiveMentoringTemplateQuery', () => {
  it('GET template 를 호출하고 파싱해 반환한다', async () => {
    axiosMock.get.mockResolvedValue({ data: { data: makeTemplate() } });

    const { result } = renderHook(() => useLiveMentoringTemplateQuery(), {
      wrapper: createWrapper(newClient()),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(axiosMock.get).toHaveBeenCalledWith(
      '/mentor/live-mentoring/template',
    );
    expect(result.current.data?.checklist[0].mode).toBe('SHOWN');
  });
});

describe('useLiveMentoringSettlementQuery', () => {
  it('settlementList 만 추출해 반환한다', async () => {
    axiosMock.get.mockResolvedValue({
      data: {
        data: {
          settlementList: [
            {
              period: '2026-06',
              completedCount: 18,
              grossAmount: 1080000,
              status: 'PAID',
            },
          ],
        },
      },
    });

    const { result } = renderHook(() => useLiveMentoringSettlementQuery(), {
      wrapper: createWrapper(newClient()),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].status).toBe('PAID');
  });
});

describe('useLiveMentoringOpenStatusQuery', () => {
  it('openStatusList 만 추출해 반환한다', async () => {
    axiosMock.get.mockResolvedValue({
      data: {
        data: {
          openStatusList: [
            {
              categories: ['PERSONAL_STATEMENT'],
              durations: [50],
              price: 60000,
              feedbackStartDate: '2026-07-14',
              feedbackEndDate: '2026-07-28',
              status: 'OPEN',
              reservationCount: 7,
            },
          ],
        },
      },
    });

    const { result } = renderHook(() => useLiveMentoringOpenStatusQuery(), {
      wrapper: createWrapper(newClient()),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.[0].reservationCount).toBe(7);
  });
});

// ── mutation 훅 (PUT echo) ────────────────────────────────────
describe('useUpdateLiveMentoringSettingsMutation', () => {
  it('PUT settings 에 body 를 보내고 echo 를 파싱, 캐시를 invalidate 한다', async () => {
    const settings = makeSettings({ mosaicEnabled: true, mosaicBlur: 12 });
    axiosMock.put.mockResolvedValue({ data: { data: settings } });

    const client = newClient();
    const invalidateSpy = vi.spyOn(client, 'invalidateQueries');

    const { result } = renderHook(
      () => useUpdateLiveMentoringSettingsMutation(),
      { wrapper: createWrapper(client) },
    );

    await act(async () => {
      await result.current.mutateAsync(settings as never);
    });

    expect(axiosMock.put).toHaveBeenCalledWith(
      '/mentor/live-mentoring/settings',
      settings,
    );
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: LIVE_MENTORING_SETTINGS_QUERY_KEY,
    });
  });
});

describe('useUpdateLiveMentoringTemplateMutation', () => {
  it('PUT template 에 body 를 보내고 echo 를 파싱, 캐시를 invalidate 한다', async () => {
    const template = makeTemplate({ mentoringPoints: '수정본' });
    axiosMock.put.mockResolvedValue({ data: { data: template } });

    const client = newClient();
    const invalidateSpy = vi.spyOn(client, 'invalidateQueries');

    const { result } = renderHook(
      () => useUpdateLiveMentoringTemplateMutation(),
      { wrapper: createWrapper(client) },
    );

    await act(async () => {
      await result.current.mutateAsync(template as never);
    });

    expect(axiosMock.put).toHaveBeenCalledWith(
      '/mentor/live-mentoring/template',
      template,
    );
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: LIVE_MENTORING_TEMPLATE_QUERY_KEY,
    });
  });
});
