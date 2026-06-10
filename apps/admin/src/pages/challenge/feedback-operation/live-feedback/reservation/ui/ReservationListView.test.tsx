import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { FeedbackAdminVo } from '@/api/feedback/feedbackSchema';
import ReservationListView from './ReservationListView';

const row: FeedbackAdminVo = {
  feedbackId: 7,
  programTitle: '면접준비 챌린지',
  mentorId: 101,
  mentorName: '쥬디',
  menteeName: '홍길동',
  startDate: '2026-05-29T17:00:00',
  endDate: '2026-05-29T17:30:00',
  createDate: '2026-05-20T09:05:00',
  mentorStatus: 'PENDING',
  menteeStatus: 'PENDING',
  status: 'RESERVED',
};

const sort = { key: 'dateTime' as const, direction: 'asc' as const };

const baseProps = {
  sort,
  onToggleSort: vi.fn(),
  onView: vi.fn(),
  onReschedule: vi.fn(),
};

describe('ReservationListView', () => {
  it('행 데이터와 날짜 포맷을 표시한다', () => {
    render(
      <ReservationListView
        {...baseProps}
        reservations={[row]}
        isLoading={false}
      />,
    );
    expect(
      screen.getByText('2026년 5월 29일 금요일 17:00-17:30'),
    ).toBeInTheDocument();
    expect(screen.getByText('면접준비 챌린지')).toBeInTheDocument();
    expect(screen.getByText('쥬디')).toBeInTheDocument();
    expect(screen.getByText('홍길동')).toBeInTheDocument();
    expect(screen.getByText('2026-05-20 09:05')).toBeInTheDocument();
  });

  it('진리표 상태 컬럼(출석/뱃지)을 렌더한다', () => {
    // row: 2026-05-29 종료 = 과거, 멘토·멘티 PENDING → 멘토 미진행 / 멘티 미참여
    render(
      <ReservationListView
        {...baseProps}
        reservations={[row]}
        isLoading={false}
      />,
    );
    expect(screen.getByText('멘토 출석')).toBeInTheDocument();
    expect(screen.getByText('멘티 출석')).toBeInTheDocument();
    expect(screen.getByText('멘토 뱃지')).toBeInTheDocument();
    expect(screen.getByText('멘티 뱃지')).toBeInTheDocument();
    expect(screen.getByText('미진행')).toBeInTheDocument();
    expect(screen.getByText('미참여')).toBeInTheDocument();
  });

  it('로딩 중에는 안내 문구를 표시한다', () => {
    render(<ReservationListView {...baseProps} reservations={[]} isLoading />);
    expect(screen.getByText('불러오는 중...')).toBeInTheDocument();
  });

  it('빈 목록은 안내 문구를 표시한다', () => {
    render(
      <ReservationListView
        {...baseProps}
        reservations={[]}
        isLoading={false}
      />,
    );
    expect(screen.getByText('예약 내역이 없습니다.')).toBeInTheDocument();
  });

  it('정렬 헤더 클릭 시 해당 키로 onToggleSort 를 호출한다', () => {
    const onToggleSort = vi.fn();
    render(
      <ReservationListView
        {...baseProps}
        onToggleSort={onToggleSort}
        reservations={[row]}
        isLoading={false}
      />,
    );
    fireEvent.click(screen.getByText('멘티'));
    expect(onToggleSort).toHaveBeenCalledWith('menteeName');
  });

  it('보기 클릭 시 feedbackId 로 onView 를 호출한다', () => {
    const onView = vi.fn();
    render(
      <ReservationListView
        {...baseProps}
        onView={onView}
        reservations={[row]}
        isLoading={false}
      />,
    );
    fireEvent.click(screen.getByText('보기'));
    expect(onView).toHaveBeenCalledWith(7);
  });

  it('예약 변경 클릭 시 해당 행으로 onReschedule 를 호출한다', () => {
    const onReschedule = vi.fn();
    render(
      <ReservationListView
        {...baseProps}
        onReschedule={onReschedule}
        reservations={[row]}
        isLoading={false}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '예약 변경' }));
    expect(onReschedule).toHaveBeenCalledWith(row);
  });
});
