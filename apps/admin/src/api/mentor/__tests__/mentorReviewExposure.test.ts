import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const get = vi.fn();
const patch = vi.fn();

vi.mock('@/utils/axios', () => ({
  default: {
    get: (...args: unknown[]) => get(...args),
    patch: (...args: unknown[]) => patch(...args),
  },
}));

// mentor.ts 가 함께 import 하는 v2 인스턴스. 이 테스트는 쓰지 않는다
vi.mock('@/utils/axiosV2', () => ({ default: {} }));

import {
  AdminMentorReviewListQueryKey,
  useAdminMentorReviewListQuery,
  usePatchAdminMentorReviewContent,
  usePatchAdminMentorReviewExposure,
} from '../mentor';
import { adminMentorReviewListSchema } from '../mentorSchema';

const review = {
  source: 'REVIEW',
  sourceId: 11,
  type: 'CHALLENGE',
  programTitle: '자소서 챌린지',
  score: 5,
  review: '좋았어요',
  originalScore: 5,
  originalReview: '좋았어요',
  isEdited: false,
  createDate: '2026-10-01T12:00:00',
  isExposed: true,
};

const createClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

const createWrapper = (client: QueryClient) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return createElement(QueryClientProvider, { client }, children);
  };

afterEach(() => {
  get.mockReset();
  patch.mockReset();
});

describe('adminMentorReviewListSchema', () => {
  it('후기 목록 응답을 파싱한다', () => {
    expect(adminMentorReviewListSchema.parse({ reviewList: [review] })).toEqual(
      { reviewList: [review] },
    );
  });

  it('score 가 null 인 후기를 받는다', () => {
    const parsed = adminMentorReviewListSchema.parse({
      reviewList: [{ ...review, score: null }],
    });
    expect(parsed.reviewList[0].score).toBeNull();
  });

  it('review 와 createDate 가 null 인 후기를 받는다', () => {
    const parsed = adminMentorReviewListSchema.parse({
      reviewList: [{ ...review, review: null, createDate: null }],
    });
    expect(parsed.reviewList[0].review).toBeNull();
    expect(parsed.reviewList[0].createDate).toBeNull();
  });

  it('수정 여부와 원본 값이 없는 응답은 거부한다', () => {
    const { isEdited: _isEdited, ...withoutEdited } = review;
    expect(() =>
      adminMentorReviewListSchema.parse({ reviewList: [withoutEdited] }),
    ).toThrow();
  });

  it('모르는 종류는 거부한다', () => {
    expect(() =>
      adminMentorReviewListSchema.parse({
        reviewList: [{ ...review, type: 'UNKNOWN' }],
      }),
    ).toThrow();
  });
});

describe('useAdminMentorReviewListQuery', () => {
  it('멘토 후기 목록 경로로 조회하고 reviewList 를 돌려준다', async () => {
    get.mockResolvedValue({ data: { data: { reviewList: [review] } } });

    const { result } = renderHook(() => useAdminMentorReviewListQuery(7), {
      wrapper: createWrapper(createClient()),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(get).toHaveBeenCalledWith('/admin/mentor/7/reviews');
    expect(result.current.data).toEqual([review]);
  });
});

describe('usePatchAdminMentorReviewExposure', () => {
  it('노출 변경 경로와 바디로 호출하고 목록 쿼리 키만 무효화한다', async () => {
    patch.mockResolvedValue({ data: { data: null } });
    const client = createClient();
    const invalidate = vi.spyOn(client, 'invalidateQueries');

    const { result } = renderHook(() => usePatchAdminMentorReviewExposure(7), {
      wrapper: createWrapper(client),
    });

    await result.current.mutateAsync({
      source: 'REVIEW',
      sourceId: 11,
      isExposed: false,
    });

    expect(patch).toHaveBeenCalledWith('/admin/mentor/7/reviews/exposure', {
      source: 'REVIEW',
      sourceId: 11,
      isExposed: false,
    });
    expect(invalidate).toHaveBeenCalledTimes(1);
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: [AdminMentorReviewListQueryKey, 7],
    });
  });
});

describe('usePatchAdminMentorReviewContent', () => {
  it('수정 경로와 바디로 호출하고 목록 쿼리 키만 무효화한다', async () => {
    patch.mockResolvedValue({ data: { data: null } });
    const client = createClient();
    const invalidate = vi.spyOn(client, 'invalidateQueries');

    const { result } = renderHook(() => usePatchAdminMentorReviewContent(7), {
      wrapper: createWrapper(client),
    });

    await result.current.mutateAsync({
      source: 'REVIEW',
      sourceId: 11,
      score: 4.5,
      review: null,
    });

    expect(patch).toHaveBeenCalledWith('/admin/mentor/7/reviews/content', {
      source: 'REVIEW',
      sourceId: 11,
      score: 4.5,
      review: null,
    });
    expect(invalidate).toHaveBeenCalledTimes(1);
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: [AdminMentorReviewListQueryKey, 7],
    });
  });
});
