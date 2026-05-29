import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { FeedbackDetailAdminVo } from '@/api/feedback/feedbackSchema';

const detail: FeedbackDetailAdminVo = {
  feedbackId: 1,
  programTitle: '면접 준비 7일 끝장 챌린지 2기',
  mentorName: '쥬디',
  mentorEmail: 'judy@letscareer.co.kr',
  menteeName: '홍길동',
  menteeEmail: 'hong@example.com',
  menteePhoneNum: '01012340001',
  startDate: '2026-06-01T17:00:00',
  endDate: '2026-06-01T17:30:00',
  createDate: '2026-05-20T10:12:00',
  preQuestion: '면접에서 자기소개를 어떻게 시작하면 좋을까요?',
  meetingUrl: 'https://meet.google.com/abc-defg-hij',
  mentorStatus: 'PRESENT',
  menteeStatus: 'PENDING',
};

const useAdminFeedbackDetailQuery = vi.fn();

vi.mock('@/api/feedback/feedback', () => ({
  useAdminFeedbackDetailQuery: (id?: number) => useAdminFeedbackDetailQuery(id),
}));

import ReservationDetailModal from './ReservationDetailModal';

describe('ReservationDetailModal', () => {
  it('feedbackId 가 null 이면 아무것도 렌더하지 않는다', () => {
    useAdminFeedbackDetailQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
    });
    const { container } = render(
      <ReservationDetailModal feedbackId={null} onClose={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('상세 데이터를 필드에 매핑해 표시한다', () => {
    useAdminFeedbackDetailQuery.mockReturnValue({
      data: detail,
      isLoading: false,
    });
    render(<ReservationDetailModal feedbackId={1} onClose={vi.fn()} />);

    expect(
      screen.getByText('면접 준비 7일 끝장 챌린지 2기'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('2026년 6월 1일 월요일 17:00-17:30'),
    ).toBeInTheDocument();
    expect(screen.getByText('쥬디')).toBeInTheDocument();
    expect(screen.getByText('judy@letscareer.co.kr')).toBeInTheDocument();
    expect(screen.getByText('홍길동')).toBeInTheDocument();
    expect(screen.getByText('hong@example.com')).toBeInTheDocument();
    expect(screen.getByText('01012340001')).toBeInTheDocument();
    // 출석 상태 한글 매핑
    expect(screen.getByText('참석')).toBeInTheDocument();
    expect(screen.getByText('대기')).toBeInTheDocument();
    // 사전 질문 / 미팅 URL
    expect(
      screen.getByText('면접에서 자기소개를 어떻게 시작하면 좋을까요?'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('https://meet.google.com/abc-defg-hij'),
    ).toBeInTheDocument();
  });

  it('로딩 중에는 안내 문구를 표시한다', () => {
    useAdminFeedbackDetailQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
    });
    render(<ReservationDetailModal feedbackId={1} onClose={vi.fn()} />);
    expect(screen.getByText('불러오는 중...')).toBeInTheDocument();
  });
});
