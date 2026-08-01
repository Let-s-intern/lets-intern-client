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
    liveMentoringId: 12,
    nickname: '자소서장인',
    profileImage: null,
    introduction: '소개',
    careers: [
      {
        id: 1,
        company: '네이버',
        field: '기획',
        job: '기획',
        position: '기획',
        department: null,
        employmentType: '정규직',
        startDate: '2019-01',
        endDate: null,
        isAddedByAdmin: false,
        isRepresentative: true,
      },
    ],
    title: '자소서 실전 첨삭 멘토링',
    status: 'DRAFT',
    categories: ['PERSONAL_STATEMENT'],
    ...overrides,
  };
}

function makeSettingsUpdate(overrides: Record<string, unknown> = {}) {
  return {
    title: '자소서 실전 첨삭 멘토링',
    categories: ['PERSONAL_STATEMENT'],
    ...overrides,
  };
}

function makeTemplate(overrides: Record<string, unknown> = {}) {
  return {
    mentoring: {
      liveMentoringId: 12,
      title: '자소서 실전 첨삭 멘토링',
      status: 'DRAFT',
      editable: true,
      category: 'RESUME',
    },
    currentOpening: null,
    category: 'RESUME',
    hero: { bullets: ['이력서, 자기소개서, 포트폴리오 피드백 및 첨삭'] },
    intro: {
      passedCount: 120,
      profileImage: null,
      affiliation: '카카오 | 백엔드',
      careerLines: ['카카오 | 백엔드 (3년)'],
      oneLiner: '소개',
    },
    mentoringTypes: {
      title: '이런 도움을 받을 수 있어요',
      subtitle: '고민에 맞는 유형을 골라보세요.',
      items: [
        {
          typeName: '이력서 피드백',
          title: '이력서를 정리하고 싶다면',
          description: '경험과 역량이 잘 보이도록 점검해요.',
          tags: ['경험 정리'],
        },
      ],
    },
    strategy: {
      visible: true,
      title: '취업 성공 전략',
      subtitle: '알려드립니다.',
      points: [{ image: null, title: '핵심 키워드', description: '설명' }],
    },
    video: {
      visible: true,
      title: '이렇게 도와드려요',
      subtitle: '미리 확인하세요',
      videoUrl: 'https://www.youtube.com/embed/xyz',
      caption: '완성도 UP!',
    },
    results: {
      visible: true,
      title: '함께 완성해요',
      subtitle: '결과 사례',
      cases: [
        {
          beforeImage: null,
          afterImage: null,
          beforeCaption: '전',
          afterCaption: '후',
        },
      ],
    },
    reviews: { visible: true, selectedReviewIds: [1] },
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

  it('status가 상품 상태 enum 밖이면 파싱 실패', () => {
    expect(() =>
      liveMentoringSettingsSchema.parse(makeSettings({ status: 'OPEN' })),
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
      data: { data: makeSettings({ status: 'OPEN' }) },
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
    expect(result.current.data?.intro.passedCount).toBe(120);
    expect(result.current.data?.mentoringTypes.items).toHaveLength(1);
  });
});

describe('useLiveMentoringSettlementQuery', () => {
  it('settlementList 와 itemList 를 함께 반환한다', async () => {
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
          itemList: [
            {
              settlementId: 1,
              date: '2026-06-28',
              menteeName: '김**',
              category: 'PERSONAL_STATEMENT',
              durationMin: 60,
              amount: 60000,
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
    expect(result.current.data?.settlementList).toHaveLength(1);
    expect(result.current.data?.settlementList[0].status).toBe('PAID');
    expect(result.current.data?.itemList[0].menteeName).toBe('김**');
  });
});

describe('useLiveMentoringOpenStatusQuery', () => {
  it('openStatusList 만 추출해 반환한다', async () => {
    axiosMock.get.mockResolvedValue({
      data: {
        data: {
          openStatusList: [
            {
              title: '자소서 실전 첨삭 멘토링',
              categories: ['PERSONAL_STATEMENT'],
              durations: [60],
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

// ── mutation 훅 (PUT — 6개 필드만 보내고, 응답은 전체 설정) ────
describe('useUpdateLiveMentoringSettingsMutation', () => {
  it('PUT settings 에 title·categories 2개만 보내고, 전체 설정 응답을 파싱해 캐시를 invalidate 한다', async () => {
    const update = makeSettingsUpdate();
    const responseSettings = makeSettings();
    axiosMock.put.mockResolvedValue({ data: { data: responseSettings } });

    const client = newClient();
    const invalidateSpy = vi.spyOn(client, 'invalidateQueries');

    const { result } = renderHook(
      () => useUpdateLiveMentoringSettingsMutation(),
      { wrapper: createWrapper(client) },
    );

    await act(async () => {
      await result.current.mutateAsync(update as never);
    });

    expect(axiosMock.put).toHaveBeenCalledWith(
      '/mentor/live-mentoring/settings',
      update,
    );
    await waitFor(() =>
      expect(result.current.data?.nickname).toBe('자소서장인'),
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
