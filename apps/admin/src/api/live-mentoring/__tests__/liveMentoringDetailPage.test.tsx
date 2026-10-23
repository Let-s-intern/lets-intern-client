import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const getMock = vi.fn();
const putMock = vi.fn();

vi.mock('@/utils/axios', () => ({
  default: {
    get: (...args: unknown[]) => getMock(...args),
    put: (...args: unknown[]) => putMock(...args),
  },
}));

import {
  useAdminLiveMentoringDetailPageQuery,
  useUpdateAdminLiveMentoringDetailPageMutation,
} from '../liveMentoringDetailPage';
import { adminLiveMentoringDetailPageSchema } from '../liveMentoringDetailPageSchema';

/*
 * 서버 `GetLiveMentoringDetailPageResponseDto` 형태를 줄여 옮긴 예시다(기록한 픽스처가 아니다).
 * 이 화면이 쓰지 않는 키(faq·process·reviewItems·currentOpening 등)도 섞어 둔다.
 */
const response = {
  mentoring: {
    liveMentoringId: 1,
    title: '1:1 멘토링',
    status: 'APPROVED',
    categories: ['RESUME'],
  },
  currentOpening: null,
  categories: ['RESUME'],
  intro: {
    passedCount: null,
    nickname: '멘토',
    profileImage: null,
    corpImage: null,
    oneLiner: '',
    description: null,
    careers: [],
    affiliation: '',
    careerLines: [],
  },
  hero: { bullets: ['불릿'] },
  mentoringTypes: {
    title: '유형',
    subtitle: '부제',
    items: [
      { typeName: '이력서', title: '카드', description: '설명', tags: [] },
    ],
  },
  strategy: { visible: false, title: '', subtitle: '', points: [] },
  video: {
    visible: false,
    title: '',
    subtitle: '',
    videoUrl: null,
    caption: '',
  },
  results: { visible: false, title: '', subtitle: '', cases: [] },
  reviews: { visible: true, selectedReviewIds: [] },
  faq: [],
  process: [],
  reviewItems: [],
};

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
};

describe('liveMentoringDetailPage API', () => {
  afterEach(() => vi.clearAllMocks());

  it('서버 응답을 파싱하고 쓰지 않는 키는 버린다', () => {
    const parsed = adminLiveMentoringDetailPageSchema.parse(response);
    expect(parsed.intro?.nickname).toBe('멘토');
    expect(parsed).not.toHaveProperty('faq');
  });

  it('mentorId 경로로 조회한다', async () => {
    getMock.mockResolvedValue({ data: { data: response } });
    const { result } = renderHook(
      () => useAdminLiveMentoringDetailPageQuery(7),
      { wrapper: createWrapper() },
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(getMock).toHaveBeenCalledWith(
      '/admin/live-mentoring/mentors/7/detail-page',
    );
  });

  it('mentorId 경로로 PUT 한다', async () => {
    putMock.mockResolvedValue({ data: { data: response } });
    const { result } = renderHook(
      () => useUpdateAdminLiveMentoringDetailPageMutation(7),
      { wrapper: createWrapper() },
    );
    const body = adminLiveMentoringDetailPageSchema.parse(response);
    await act(() => result.current.mutateAsync(body));
    expect(putMock).toHaveBeenCalledWith(
      '/admin/live-mentoring/mentors/7/detail-page',
      body,
    );
  });
});
