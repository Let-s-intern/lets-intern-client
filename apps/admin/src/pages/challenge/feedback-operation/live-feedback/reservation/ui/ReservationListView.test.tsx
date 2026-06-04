import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { FeedbackAdminVo } from '@/api/feedback/feedbackSchema';
import type { ResolveMentorIdResult } from '../utils/resolveMentorId';
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

/** 기본 resolver — API mentorId 가 있으면 그 값, 없으면 미매칭(not-found). */
const defaultResolve = (r: FeedbackAdminVo): ResolveMentorIdResult =>
  r.mentorId != null
    ? { mentorId: r.mentorId, reason: 'api' }
    : { mentorId: null, reason: 'not-found' };

describe('ReservationListView', () => {
  it('행 데이터와 날짜 포맷을 표시한다', () => {
    render(
      <ReservationListView
        reservations={[row]}
        sort={sort}
        onToggleSort={vi.fn()}
        onView={vi.fn()}
        onChange={vi.fn()}
        resolveMentorId={defaultResolve}
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

  it('로딩 중에는 안내 문구를 표시한다', () => {
    render(
      <ReservationListView
        reservations={[]}
        sort={sort}
        onToggleSort={vi.fn()}
        onView={vi.fn()}
        onChange={vi.fn()}
        resolveMentorId={defaultResolve}
        isLoading
      />,
    );
    expect(screen.getByText('불러오는 중...')).toBeInTheDocument();
  });

  it('빈 목록은 안내 문구를 표시한다', () => {
    render(
      <ReservationListView
        reservations={[]}
        sort={sort}
        onToggleSort={vi.fn()}
        onView={vi.fn()}
        onChange={vi.fn()}
        resolveMentorId={defaultResolve}
        isLoading={false}
      />,
    );
    expect(screen.getByText('예약 내역이 없습니다.')).toBeInTheDocument();
  });

  it('정렬 헤더 클릭 시 해당 키로 onToggleSort 를 호출한다', () => {
    const onToggleSort = vi.fn();
    render(
      <ReservationListView
        reservations={[row]}
        sort={sort}
        onToggleSort={onToggleSort}
        onView={vi.fn()}
        onChange={vi.fn()}
        resolveMentorId={defaultResolve}
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
        reservations={[row]}
        sort={sort}
        onToggleSort={vi.fn()}
        onView={onView}
        onChange={vi.fn()}
        resolveMentorId={defaultResolve}
        isLoading={false}
      />,
    );
    fireEvent.click(screen.getByText('보기'));
    expect(onView).toHaveBeenCalledWith(7);
  });

  it('RESERVED 행에서 "예약 변경" 클릭 시 해당 행으로 onChange 를 호출한다', () => {
    const onChange = vi.fn();
    render(
      <ReservationListView
        reservations={[row]}
        sort={sort}
        onToggleSort={vi.fn()}
        onView={vi.fn()}
        onChange={onChange}
        resolveMentorId={defaultResolve}
        isLoading={false}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '예약 변경' }));
    expect(onChange).toHaveBeenCalledWith(row);
  });

  it('COMPLETED 행은 "예약 변경" 버튼이 비활성이다', () => {
    render(
      <ReservationListView
        reservations={[{ ...row, status: 'COMPLETED' }]}
        sort={sort}
        onToggleSort={vi.fn()}
        onView={vi.fn()}
        onChange={vi.fn()}
        resolveMentorId={defaultResolve}
        isLoading={false}
      />,
    );
    expect(screen.getByRole('button', { name: '예약 변경' })).toBeDisabled();
  });

  it('mentorId 가 없고 폴백도 실패하면 "예약 변경" 버튼이 비활성이다', () => {
    render(
      <ReservationListView
        reservations={[{ ...row, mentorId: undefined }]}
        sort={sort}
        onToggleSort={vi.fn()}
        onView={vi.fn()}
        onChange={vi.fn()}
        resolveMentorId={defaultResolve}
        isLoading={false}
      />,
    );
    expect(screen.getByRole('button', { name: '예약 변경' })).toBeDisabled();
  });

  it('mentorId 없어도 이름 폴백 성공 시 버튼이 활성이고 resolved id 로 onChange 한다', () => {
    const onChange = vi.fn();
    const rowNoId = { ...row, mentorId: undefined };
    const resolve = (r: FeedbackAdminVo): ResolveMentorIdResult =>
      r.mentorId != null
        ? { mentorId: r.mentorId, reason: 'api' }
        : { mentorId: 305, reason: 'name-fallback' };

    render(
      <ReservationListView
        reservations={[rowNoId]}
        sort={sort}
        onToggleSort={vi.fn()}
        onView={vi.fn()}
        onChange={onChange}
        resolveMentorId={resolve}
        isLoading={false}
      />,
    );

    const button = screen.getByRole('button', { name: '예약 변경' });
    expect(button).toBeEnabled();

    fireEvent.click(button);
    expect(onChange).toHaveBeenCalledWith({ ...rowNoId, mentorId: 305 });
  });

  it('동명이인으로 폴백 실패 시 버튼이 비활성이다', () => {
    const resolve = (): ResolveMentorIdResult => ({
      mentorId: null,
      reason: 'ambiguous',
    });

    render(
      <ReservationListView
        reservations={[{ ...row, mentorId: undefined }]}
        sort={sort}
        onToggleSort={vi.fn()}
        onView={vi.fn()}
        onChange={vi.fn()}
        resolveMentorId={resolve}
        isLoading={false}
      />,
    );
    expect(screen.getByRole('button', { name: '예약 변경' })).toBeDisabled();
  });
});
