import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { FeedbackAdminVo } from '@/api/feedback/feedbackSchema';
import type { AdminLiveMentoringReservation } from '@/api/live-mentoring/liveMentoringSchema';
import {
  toChallengeRow,
  toLiveMentoringRow,
  type ReservationRow,
} from '../utils/reservationRow';
import ReservationListView from './ReservationListView';

const feedback: FeedbackAdminVo = {
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

const row = toChallengeRow(feedback);

const makeLiveMentoringRow = (
  overrides: Partial<AdminLiveMentoringReservation> = {},
): ReservationRow =>
  toLiveMentoringRow({
    applicationId: 501,
    liveMentoringId: 10,
    productName: '이력서 1대1 첨삭',
    mentorId: 21,
    mentorName: '김멘토',
    mentorNickname: '렛츠멘토',
    mentorEmail: 'mentor@letscareer.co.kr',
    menteeId: 77,
    menteeName: '최멘티',
    menteeEmail: 'choi@example.com',
    menteePhoneNum: '01012340001',
    contactEmail: null,
    durationMinutes: 30,
    reservationStartAt: '2026-05-30T19:00:00',
    reservationEndAt: '2026-05-30T19:30:00',
    status: 'CONFIRMED',
    createDate: '2026-05-21T09:00:00',
    questionDeferred: false,
    questionContent: null,
    ...overrides,
  });

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

  it('보기 클릭 시 해당 행으로 onView 를 호출한다', () => {
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
    expect(onView).toHaveBeenCalledWith(row);
  });

  it('예약 변경 클릭 시 해당 예약으로 onReschedule 를 호출한다', () => {
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
    expect(onReschedule).toHaveBeenCalledWith(feedback);
  });

  describe('1대1 라이브 멘토링 행', () => {
    const renderMixed = (liveMentoringRow = makeLiveMentoringRow()) =>
      render(
        <ReservationListView
          {...baseProps}
          reservations={[row, liveMentoringRow]}
          isLoading={false}
        />,
      );

    it('1대1 행도 상세를 열 수 있다', () => {
      const onView = vi.fn();
      const liveMentoringRow = makeLiveMentoringRow();
      render(
        <ReservationListView
          {...baseProps}
          onView={onView}
          reservations={[liveMentoringRow]}
          isLoading={false}
        />,
      );
      fireEvent.click(screen.getByText('보기'));
      expect(onView).toHaveBeenCalledWith(liveMentoringRow);
    });

    it('두 유형을 한 표에 싣고 유형 컬럼으로 구분한다', () => {
      renderMixed();
      expect(screen.getByText('챌린지 라이브 피드백')).toBeInTheDocument();
      expect(screen.getByText('1대1 라이브 멘토링')).toBeInTheDocument();
      expect(screen.getByText('이력서 1대1 첨삭')).toBeInTheDocument();
      expect(screen.getByText('최멘티')).toBeInTheDocument();
    });

    it('멘토는 닉네임으로, 플랜과 결제 상태를 함께 표시한다', () => {
      renderMixed();
      expect(screen.getByText('렛츠멘토')).toBeInTheDocument();
      expect(screen.getByText('결제 완료 · 30분')).toBeInTheDocument();
    });

    // 빈 칸은 "없음"이 아니라 "조회가 빠졌다"로 읽힌다.
    it('챌린지에만 있는 칸은 비우지 않고 해당 없음으로 채운다', () => {
      renderMixed();
      const liveMentoringCell = screen.getByText('1대1 라이브 멘토링');
      const liveMentoringTr = liveMentoringCell.closest('tr') as HTMLElement;
      // 멘토·멘티 출석, 멘토·멘티 뱃지, 예약 변경 다섯 칸.
      expect(within(liveMentoringTr).getAllByText('해당 없음')).toHaveLength(5);
    });

    it('예약 슬롯이 없는 신청도 행으로 보여 준다', () => {
      renderMixed(
        makeLiveMentoringRow({
          status: 'PAYMENT_PENDING',
          reservationStartAt: null,
          reservationEndAt: null,
        }),
      );
      expect(screen.getByText('예약 슬롯 없음')).toBeInTheDocument();
      expect(screen.getByText('결제 대기 · 30분')).toBeInTheDocument();
    });
  });
});
