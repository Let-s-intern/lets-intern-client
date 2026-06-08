import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import FeedbackLiveReservationPage from '../FeedbackLiveReservationPage';

const useFeedbackMentorListQueryMock = vi.fn();
const useUserQueryMock = vi.fn();
const useFeedbackMentorDetailQueryMock = vi.fn();
const useFeedbackMentorSlotsQueryMock = vi.fn();

const noopMutation = {
  mutate: vi.fn(),
  mutateAsync: vi.fn(),
  isPending: false,
};

vi.mock('@/api/feedback/feedback', () => ({
  useFeedbackMentorListQuery: () => useFeedbackMentorListQueryMock(),
  useFeedbackMentorDetailQuery: (id: number | null) =>
    useFeedbackMentorDetailQueryMock(id),
  useFeedbackMentorSlotsQuery: () => useFeedbackMentorSlotsQueryMock(),
  useUpdateFeedbackByMentorMutation: () => noopMutation,
  useUpdateFeedbackMeetingUrlMutation: () => noopMutation,
}));

vi.mock('@/api/user/user', () => ({
  useUserQuery: () => useUserQueryMock(),
}));

function renderPage() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <FeedbackLiveReservationPage />
    </QueryClientProvider>,
  );
}

afterEach(() => {
  vi.clearAllMocks();
});

describe('FeedbackLiveReservationPage', () => {
  it('페이지 헤더와 본문(ReservationListContent) 섹션을 노출한다', () => {
    useFeedbackMentorListQueryMock.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
    useUserQueryMock.mockReturnValue({ data: { name: '테스트 멘토' } });
    useFeedbackMentorDetailQueryMock.mockReturnValue({ data: undefined });
    useFeedbackMentorSlotsQueryMock.mockReturnValue({
      data: { feedbackSlotList: [] },
      isLoading: false,
      isError: false,
    });

    renderPage();

    expect(
      screen.getByRole('heading', { name: '예약 현황' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: '예약 목록' }),
    ).toBeInTheDocument();
    // 변경 내역은 별도 테이블이 아니라 예약 목록 행의 드롭다운으로 통합됨.
    expect(
      screen.queryByRole('heading', { name: '예약 변경 내역' }),
    ).not.toBeInTheDocument();
  });
});
