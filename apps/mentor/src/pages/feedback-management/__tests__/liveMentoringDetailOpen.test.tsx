/**
 * 피드백 현황 표 — 1대1 행의 `상세` 열기 검증.
 *
 * 멘티 제출물 모달이 생기기 전에는 이 행의 상세가 잠겨 있었다. 이제는 챌린지 행과
 * 똑같이 `보기` 로 열리고, 잠긴 표시("준비 중")가 남아 있지 않아야 한다.
 * 서면 미제출처럼 이유 없이 잠긴 행의 하이픈 표시는 그대로여야 한다.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { FeedbackRow } from '../types';
import FeedbackTable from '../ui/FeedbackTable';

const liveMentoringRow: FeedbackRow = {
  id: 'live-mentoring-91001',
  type: 'live-mentoring',
  startDate: '2026-05-04',
  startTime: '14:00',
  endTime: '15:00',
  statusLabel: '진행 예정',
  statusTone: 'liveWaiting',
  reservationLabel: '예약 완료',
  submissionLabel: '일부 제출',
  menteeParticipation: null,
  mentorParticipation: null,
  challengeTitle: '1대1 라이브 멘토링',
  thLabel: '해당 없음',
  scheduleLabel: '2026.05.04 14:00 ~ 15:00',
  menteeNameLabel: '김일대',
  canOpenDetail: true,
  detailDisabledReason: null,
  source: { type: 'live-mentoring', reservation: {} as never },
};

const writtenRow: FeedbackRow = {
  id: 'written-1-1001-11',
  type: 'written',
  startDate: '2026-05-04',
  startTime: null,
  endTime: null,
  statusLabel: '진행 중',
  statusTone: 'inProgress',
  reservationLabel: null,
  submissionLabel: '제출',
  menteeParticipation: null,
  mentorParticipation: null,
  challengeTitle: '경험정리 챌린지 21기',
  thLabel: '1회차',
  scheduleLabel: '2026.05.04 ~ 2026.05.06',
  menteeNameLabel: '이지수',
  canOpenDetail: true,
  detailDisabledReason: null,
  source: {
    type: 'written',
    challengeId: 1,
    missionId: 1001,
    missionTh: 1,
    challengeTitle: '경험정리 챌린지 21기',
    attendanceId: 11,
  },
};

describe('1대1 행의 상세', () => {
  it('보기 버튼으로 열 수 있다', () => {
    render(<FeedbackTable rows={[liveMentoringRow]} onClickDetail={vi.fn()} />);

    expect(screen.getByRole('button', { name: '보기' })).toBeEnabled();
  });

  it('잠긴 표시가 남아 있지 않다', () => {
    render(<FeedbackTable rows={[liveMentoringRow]} onClickDetail={vi.fn()} />);

    expect(screen.queryByText('준비 중')).toBeNull();
  });

  it('누르면 그 행이 onClickDetail 로 전달된다', async () => {
    const onClickDetail = vi.fn();
    render(
      <FeedbackTable rows={[liveMentoringRow]} onClickDetail={onClickDetail} />,
    );

    await userEvent.click(screen.getByRole('button', { name: '보기' }));
    expect(onClickDetail).toHaveBeenCalledTimes(1);
    expect(onClickDetail).toHaveBeenCalledWith(liveMentoringRow);
  });
});

describe('챌린지 행의 상세', () => {
  it('1대1 행과 섞여 있어도 그대로 동작한다', async () => {
    const onClickDetail = vi.fn();
    render(
      <FeedbackTable
        rows={[liveMentoringRow, writtenRow]}
        onClickDetail={onClickDetail}
      />,
    );

    const buttons = screen.getAllByRole('button', { name: '보기' });
    expect(buttons).toHaveLength(2);

    await userEvent.click(buttons[1]);
    expect(onClickDetail).toHaveBeenCalledTimes(1);
    expect(onClickDetail).toHaveBeenCalledWith(writtenRow);
  });

  it('이유 없이 잠긴 행은 기존대로 하이픈만 보여 준다 (서면 미제출)', () => {
    render(
      <FeedbackTable
        rows={[{ ...writtenRow, canOpenDetail: false }]}
        onClickDetail={vi.fn()}
      />,
    );

    expect(screen.queryByRole('button', { name: /준비 중/ })).toBeNull();
    expect(screen.getByText('-')).toBeInTheDocument();
  });
});

describe('1대1 행의 컬럼', () => {
  it('챌린지·미션 회차 칸이 비어 있지 않다', () => {
    render(<FeedbackTable rows={[liveMentoringRow]} onClickDetail={vi.fn()} />);

    expect(screen.getByText('1대1 라이브 멘토링')).toBeInTheDocument();
    expect(screen.getByText('해당 없음')).toBeInTheDocument();
    expect(screen.getByText('일부 제출')).toBeInTheDocument();
  });

  it('구분 아이콘이 1대1로 표시된다', () => {
    render(<FeedbackTable rows={[liveMentoringRow]} onClickDetail={vi.fn()} />);

    expect(
      screen.getByRole('img', { name: '1대1 라이브 멘토링' }),
    ).toBeInTheDocument();
  });
});
