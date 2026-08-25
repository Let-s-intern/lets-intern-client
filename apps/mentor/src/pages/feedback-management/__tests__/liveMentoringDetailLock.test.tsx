/**
 * 피드백 현황 표 — 1대1 행의 `상세` 잠금 검증 (Push 7-B).
 *
 * 멘토가 멘티 질문·전달 파일을 볼 화면이 아직 없어 1대1 행의 상세를 잠근다.
 * `disabled` 만 걸면 고장으로 읽히므로 왜 못 누르는지가 함께 보여야 하고,
 * 챌린지 행의 `보기` 는 그대로 동작해야 한다.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { FeedbackRow } from '../types';
import FeedbackTable from '../ui/FeedbackTable';

const REASON = '멘티 질문·전달 파일을 여는 화면이 아직 없습니다';

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
  canOpenDetail: false,
  detailDisabledReason: REASON,
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
  it('비활성이다', () => {
    render(<FeedbackTable rows={[liveMentoringRow]} onClickDetail={vi.fn()} />);

    const button = screen.getByRole('button', { name: /준비 중/ });
    expect(button).toBeDisabled();
  });

  it('왜 못 누르는지 알 수 있다', () => {
    render(<FeedbackTable rows={[liveMentoringRow]} onClickDetail={vi.fn()} />);

    expect(screen.getByText('준비 중')).toBeInTheDocument();
    const button = screen.getByRole('button', { name: /준비 중/ });
    expect(button.getAttribute('title')).toBe(REASON);
    expect(button.getAttribute('aria-label')).toContain(REASON);
  });

  it('눌러도 onClickDetail 이 호출되지 않는다', async () => {
    const onClickDetail = vi.fn();
    render(
      <FeedbackTable rows={[liveMentoringRow]} onClickDetail={onClickDetail} />,
    );

    await userEvent.click(screen.getByRole('button', { name: /준비 중/ }));
    expect(onClickDetail).not.toHaveBeenCalled();
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

    await userEvent.click(screen.getByRole('button', { name: '보기' }));
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
