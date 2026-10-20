import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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

import MentorReviewExposureSection from '../ui/MentorReviewExposureSection';

const exposedReview = {
  source: 'REVIEW',
  sourceId: 11,
  type: 'CHALLENGE',
  programTitle: '자소서 챌린지',
  score: 5,
  review: '정말 좋았어요',
  createDate: '2026-10-01T12:00:00',
  isExposed: true,
};

const hiddenReview = {
  source: 'FEEDBACK',
  sourceId: 22,
  type: 'LIVE_MENTORING',
  programTitle: null,
  score: null,
  review: '숨긴 후기',
  createDate: null,
  isExposed: false,
};

const mockList = (reviewList: unknown[]) =>
  get.mockResolvedValue({ data: { data: { reviewList } } });

const renderSection = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <MentorReviewExposureSection mentorId={7} />
    </QueryClientProvider>,
  );
};

const getSwitches = () =>
  screen.getAllByRole('checkbox', { name: '노출' }) as HTMLInputElement[];

afterEach(() => {
  get.mockReset();
  patch.mockReset();
  vi.restoreAllMocks();
});

describe('MentorReviewExposureSection', () => {
  it('노출 건수와 전체 건수, 종류 이름을 보인다', async () => {
    mockList([exposedReview, hiddenReview]);

    renderSection();

    expect(await screen.findByText('노출 1 / 전체 2')).toBeInTheDocument();
    expect(screen.getByText('챌린지')).toBeInTheDocument();
    expect(screen.getByText('1:1 LIVE 멘토링')).toBeInTheDocument();
    expect(get).toHaveBeenCalledWith('/admin/mentor/7/reviews');
  });

  it('스위치를 끄면 그 후기의 키로 PATCH 하고, 요청 중에는 그 행만 막는다', async () => {
    mockList([exposedReview, hiddenReview]);
    let resolvePatch: (value: unknown) => void = () => {};
    patch.mockReturnValue(
      new Promise((resolve) => {
        resolvePatch = resolve;
      }),
    );

    renderSection();
    await screen.findByText('정말 좋았어요');

    fireEvent.click(getSwitches()[0]);

    await waitFor(() =>
      expect(patch).toHaveBeenCalledWith('/admin/mentor/7/reviews/exposure', {
        source: 'REVIEW',
        sourceId: 11,
        isExposed: false,
      }),
    );
    expect(getSwitches()[0]).toBeDisabled();
    expect(getSwitches()[0]).not.toBeChecked();
    expect(getSwitches()[1]).not.toBeDisabled();

    resolvePatch({ data: { data: null } });
  });

  it('PATCH 가 실패하면 알림을 띄우고 스위치를 원래 값으로 되돌린다', async () => {
    mockList([exposedReview]);
    patch.mockRejectedValue(new Error('500'));
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => {});

    renderSection();
    await screen.findByText('정말 좋았어요');

    fireEvent.click(getSwitches()[0]);

    await waitFor(() => expect(alert).toHaveBeenCalledTimes(1));
    expect(getSwitches()[0]).toBeChecked();
    expect(getSwitches()[0]).not.toBeDisabled();
  });

  it('후기가 없으면 안내 문구를 보인다', async () => {
    mockList([]);

    renderSection();

    expect(
      await screen.findByText('이 멘토의 공개 후기가 없습니다'),
    ).toBeInTheDocument();
    expect(screen.getByText('노출 0 / 전체 0')).toBeInTheDocument();
  });
});
