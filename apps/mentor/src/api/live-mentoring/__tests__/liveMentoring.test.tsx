import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import axios from '@/utils/axios';

import {
  LIVE_MENTORING_SETTINGS_QUERY_KEY,
  LIVE_MENTORING_TEMPLATE_QUERY_KEY,
  LIVE_MENTORING_OPEN_STATUS_QUERY_KEY,
  useCloseLiveMentoringOpeningMutation,
  useLiveMentoringOpenStatusQuery,
  useLiveMentoringSettingsQuery,
  useLiveMentoringTemplateQuery,
  useSubmitLiveMentoringMutation,
  useUpdateLiveMentoringSettingsMutation,
  useUpdateLiveMentoringTemplateMutation,
} from '../liveMentoring';
import {
  liveMentoringSettingsSchema,
  liveMentoringStatusSchema,
  openingHistoryItemSchema,
} from '../liveMentoringSchema';

// axios 모듈 자체를 모킹 (default export)
vi.mock('@/utils/axios', () => ({
  default: { get: vi.fn(), put: vi.fn(), post: vi.fn(), patch: vi.fn() },
}));

const axiosMock = vi.mocked(axios, true);

function makeSettings(overrides: Record<string, unknown> = {}) {
  return {
    liveMentoringId: 1,
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
    durations: [60],
    feedbackStartDate: '2026-07-14',
    feedbackEndDate: '2026-07-28',
    ...overrides,
  };
}

function makeTemplate(overrides: Record<string, unknown> = {}) {
  return {
    categories: ['RESUME'],
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

  it('durations에 30/60이 아닌 값이 있으면 파싱 실패', () => {
    expect(() =>
      liveMentoringSettingsSchema.parse(makeSettings({ durations: [40] })),
    ).toThrow();
  });

  it('개설 이력 status가 enum 밖이면 파싱 실패', () => {
    expect(() =>
      openingHistoryItemSchema.parse({
        openingId: 100,
        status: 'PAUSED',
        durationPrices: [{ duration: 30, price: 35000 }],
        feedbackStartDate: '2026-07-10',
        feedbackEndDate: '2026-07-23',
        openedAt: '2026-07-09T10:00:00',
        closedAt: null,
        closeReason: null,
      }),
    ).toThrow();
  });

  it('상품이 없는 멘토의 설정(전부 null·빈 배열)도 파싱된다', () => {
    expect(() =>
      liveMentoringSettingsSchema.parse(
        makeSettings({
          liveMentoringId: null,
          title: null,
          status: null,
          categories: [],
          durations: [],
          feedbackStartDate: null,
          feedbackEndDate: null,
        }),
      ),
    ).not.toThrow();
  });

  it('서버에 없는 isOpen 에 기대지 않는다 — status 로 잠금을 판정한다', () => {
    const parsed = liveMentoringSettingsSchema.parse(
      makeSettings({ status: 'APPROVED' }),
    );
    expect(parsed.status).toBe('APPROVED');
    expect('isOpen' in parsed).toBe(false);
  });

  it('백엔드 LiveMentoringStatus 3종(DRAFT/APPROVED/INACTIVE)만 파싱한다', () => {
    expect(() => liveMentoringStatusSchema.parse('DRAFT')).not.toThrow();
    expect(() => liveMentoringStatusSchema.parse('APPROVED')).not.toThrow();
    expect(() => liveMentoringStatusSchema.parse('INACTIVE')).not.toThrow();
  });

  it('더 이상 존재하지 않는 PENDING_REVIEW/REJECTED 는 파싱 실패한다', () => {
    expect(() => liveMentoringStatusSchema.parse('PENDING_REVIEW')).toThrow();
    expect(() => liveMentoringStatusSchema.parse('REJECTED')).toThrow();
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
    expect(result.current.data?.intro.passedCount).toBe(120);
    expect(result.current.data?.mentoringTypes.items).toHaveLength(1);
  });
});

describe('useLiveMentoringOpenStatusQuery', () => {
  it('openings 만 추출해 반환한다', async () => {
    axiosMock.get.mockResolvedValue({
      data: {
        data: {
          liveMentoringId: 1,
          openings: [
            {
              openingId: 100,
              status: 'OPEN',
              durationPrices: [{ duration: 60, price: 60000 }],
              feedbackStartDate: '2026-07-14',
              feedbackEndDate: '2026-07-28',
              openedAt: '2026-07-13T10:00:00',
              closedAt: null,
              closeReason: null,
            },
          ],
        },
      },
    });

    const { result } = renderHook(() => useLiveMentoringOpenStatusQuery(), {
      wrapper: createWrapper(newClient()),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.[0].openingId).toBe(100);
    expect(result.current.data?.[0].durationPrices[0].price).toBe(60000);
  });
});

describe('useSubmitLiveMentoringMutation', () => {
  it('POST submit 에 진행시간·기간을 보내고 설정·오픈현황 캐시를 함께 invalidate 한다', async () => {
    // 회귀 케이스: 자가승인 전환으로 제출이 곧바로 개설까지 만드는데, 오픈현황 캐시를
    // 안 지우면 승인 상태는 반영돼도 "지금 열려 있는지"가 낡은 값으로 남아
    // 화면이 오픈 중을 못 보여준다.
    axiosMock.post.mockResolvedValue({ data: { data: null } });

    const client = newClient();
    const invalidateSpy = vi.spyOn(client, 'invalidateQueries');

    const { result } = renderHook(() => useSubmitLiveMentoringMutation(), {
      wrapper: createWrapper(client),
    });

    const body = {
      durations: [30, 60] as (30 | 60)[],
      feedbackStartDate: '2026-08-01',
      feedbackEndDate: '2026-08-31',
    };
    await act(async () => {
      await result.current.mutateAsync(body);
    });

    expect(axiosMock.post).toHaveBeenCalledWith(
      '/mentor/live-mentoring/submit',
      body,
    );
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: LIVE_MENTORING_SETTINGS_QUERY_KEY,
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: LIVE_MENTORING_OPEN_STATUS_QUERY_KEY,
    });
  });
});

describe('useCloseLiveMentoringOpeningMutation', () => {
  it('PATCH close 를 호출하고 개설 이력·설정 캐시를 함께 invalidate 한다', async () => {
    axiosMock.patch.mockResolvedValue({ data: { data: null } });

    const client = newClient();
    const invalidateSpy = vi.spyOn(client, 'invalidateQueries');

    const { result } = renderHook(
      () => useCloseLiveMentoringOpeningMutation(),
      { wrapper: createWrapper(client) },
    );

    await act(async () => {
      await result.current.mutateAsync(100);
    });

    expect(axiosMock.patch).toHaveBeenCalledWith(
      '/mentor/live-mentoring/openings/100/close',
    );
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: LIVE_MENTORING_OPEN_STATUS_QUERY_KEY,
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: LIVE_MENTORING_SETTINGS_QUERY_KEY,
    });
  });
});

// ── mutation 훅 (PUT — 제목·타입만 보내고, 응답은 전체 설정) ────
describe('useUpdateLiveMentoringSettingsMutation', () => {
  it('PUT settings 에 제목·타입만 보내고, 전체 설정 응답을 파싱해 캐시를 invalidate 한다', async () => {
    const update = {
      title: '자소서 실전 첨삭 멘토링',
      categories: ['PERSONAL_STATEMENT'] as ('PERSONAL_STATEMENT' | 'RESUME')[],
    };
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
