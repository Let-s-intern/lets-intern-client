import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { FeedbackMentor } from '@/api/feedback/feedbackSchema';

import FeedbackLiveReservationPage from '../FeedbackLiveReservationPage';

const useFeedbackMentorListQueryMock = vi.fn();

vi.mock('@/api/feedback/feedback', () => ({
  useFeedbackMentorListQuery: () => useFeedbackMentorListQueryMock(),
}));

function makeFeedback(overrides: Partial<FeedbackMentor> = {}): FeedbackMentor {
  return {
    feedbackId: 1,
    startDate: '2026-05-20T10:00:00',
    endDate: '2026-05-20T10:30:00',
    meetingUrl: null,
    mentorStatus: 'PENDING',
    menteeStatus: 'PENDING',
    status: 'RESERVED',
    programTitle: '자소서 챌린지 7기',
    menteeName: '이지수',
    ...overrides,
  };
}

afterEach(() => {
  vi.clearAllMocks();
});

describe('FeedbackLiveReservationPage', () => {
  it('헤더가 노출되고 mock 안내 문구는 더 이상 없다', () => {
    useFeedbackMentorListQueryMock.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
    render(<FeedbackLiveReservationPage />);
    expect(
      screen.getByRole('heading', { name: '예약 현황' }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/mock 데이터입니다/)).not.toBeInTheDocument();
  });

  it('목록 응답을 멘티명/프로그램명/상태와 함께 렌더한다', () => {
    useFeedbackMentorListQueryMock.mockReturnValue({
      data: [
        makeFeedback({
          feedbackId: 1,
          menteeName: '이지수',
          status: 'RESERVED',
        }),
        makeFeedback({
          feedbackId: 2,
          menteeName: '박서준',
          status: 'COMPLETED',
        }),
      ],
      isLoading: false,
      isError: false,
    });
    render(<FeedbackLiveReservationPage />);

    expect(screen.getByText('이지수 멘티')).toBeInTheDocument();
    expect(screen.getByText('박서준 멘티')).toBeInTheDocument();
    expect(screen.getAllByText('자소서 챌린지 7기')).toHaveLength(2);
    expect(screen.getByText('완료')).toBeInTheDocument();
    expect(screen.getByText('예정')).toBeInTheDocument();
  });

  it('탭 카운트가 status 기준으로 집계된다 (전체 2 / 예정 1 / 완료 1)', () => {
    useFeedbackMentorListQueryMock.mockReturnValue({
      data: [
        makeFeedback({ feedbackId: 1, status: 'RESERVED' }),
        makeFeedback({ feedbackId: 2, status: 'COMPLETED' }),
      ],
      isLoading: false,
      isError: false,
    });
    render(<FeedbackLiveReservationPage />);

    expect(screen.getByRole('tab', { name: /전체 2/ })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /예정 1/ })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /완료 1/ })).toBeInTheDocument();
  });

  it('완료 탭을 클릭하면 COMPLETED 항목만 노출된다', async () => {
    const user = userEvent.setup();
    useFeedbackMentorListQueryMock.mockReturnValue({
      data: [
        makeFeedback({
          feedbackId: 1,
          menteeName: '이지수',
          status: 'RESERVED',
        }),
        makeFeedback({
          feedbackId: 2,
          menteeName: '박서준',
          status: 'COMPLETED',
        }),
      ],
      isLoading: false,
      isError: false,
    });
    render(<FeedbackLiveReservationPage />);

    await user.click(screen.getByRole('tab', { name: /완료 1/ }));

    expect(screen.getByText('박서준 멘티')).toBeInTheDocument();
    expect(screen.queryByText('이지수 멘티')).not.toBeInTheDocument();
  });

  it('로딩 중이면 안내 문구를 노출한다', () => {
    useFeedbackMentorListQueryMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    });
    render(<FeedbackLiveReservationPage />);
    expect(screen.getByText('불러오는 중...')).toBeInTheDocument();
  });

  it('빈 목록이면 예약 없음 안내를 노출한다', () => {
    useFeedbackMentorListQueryMock.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
    render(<FeedbackLiveReservationPage />);
    expect(screen.getByText('아직 예약이 없습니다.')).toBeInTheDocument();
  });
});
