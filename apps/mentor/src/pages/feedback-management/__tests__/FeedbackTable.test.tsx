import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { FeedbackRow } from '../types';
import FeedbackTable from '../ui/FeedbackTable';

const writtenRow: FeedbackRow = {
  id: 'written-1-1001',
  type: 'written',
  startDate: '2026-04-05',
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
  scheduleLabel: '2026.04.05 ~ 2026.04.07',
  menteeNameLabel: '멘티 5명',
  canOpenDetail: true,
  source: {
    type: 'written',
    challengeId: 1,
    missionId: 1001,
    missionTh: 1,
    challengeTitle: '경험정리 챌린지 21기',
  },
};

const writtenNotSubmittedRow: FeedbackRow = {
  ...writtenRow,
  id: 'written-1-1003',
  submissionLabel: '미제출',
  canOpenDetail: false,
};

const liveRow: FeedbackRow = {
  id: 'live-101',
  type: 'live',
  startDate: '2026-05-04',
  startTime: '10:00',
  endTime: '10:30',
  statusLabel: '진행 전',
  statusTone: 'waiting',
  reservationLabel: '예약 완료',
  submissionLabel: null,
  menteeParticipation: null,
  mentorParticipation: null,
  challengeTitle: '경험정리 챌린지 21기',
  thLabel: '1회차',
  scheduleLabel: '2026.05.04 10:00 ~ 10:30',
  menteeNameLabel: '이지수',
  canOpenDetail: true,
  source: {
    type: 'live',
    bar: {} as never,
    round: {} as never,
  },
};

describe('FeedbackTable', () => {
  it('11컬럼 헤더를 모두 렌더한다', () => {
    render(<FeedbackTable rows={[]} onClickDetail={() => undefined} />);

    // 빈 상태에서는 헤더가 없으므로 데이터를 넘기는 케이스로 확인
    render(
      <FeedbackTable
        rows={[writtenRow, liveRow]}
        onClickDetail={() => undefined}
      />,
    );

    const expectedHeaders = [
      '구분',
      '피드백 상태',
      '멘티 예약',
      '멘티 제출',
      '멘티',
      '멘토',
      '챌린지',
      '미션 회차',
      '피드백 일정',
      '멘티 성명',
      '상세',
    ];
    for (const header of expectedHeaders) {
      expect(screen.getAllByText(header).length).toBeGreaterThan(0);
    }
  });

  it('서면 행은 멘티예약/참여/멘토참여 셀이 빈값(·)로 표시된다', () => {
    render(
      <FeedbackTable rows={[writtenRow]} onClickDetail={() => undefined} />,
    );

    // 빈 셀은 '·' 텍스트로 렌더
    const emptyCells = screen.getAllByText('·');
    // 멘티예약 + 멘티 + 멘토 = 3개
    expect(emptyCells.length).toBe(3);
  });

  it('라이브 행은 멘티 제출 셀이 빈값(·)으로 표시된다', () => {
    render(<FeedbackTable rows={[liveRow]} onClickDetail={() => undefined} />);

    // 라이브 행: 멘티제출 + 멘티 + 멘토 = 3개 빈 셀
    const emptyCells = screen.getAllByText('·');
    expect(emptyCells.length).toBe(3);
    // 예약 완료는 표시되어야 함
    expect(screen.getByText('예약 완료')).toBeInTheDocument();
  });

  it('canOpenDetail=true 행에만 보기 버튼이 렌더된다', async () => {
    const onClickDetail = vi.fn();
    render(
      <FeedbackTable
        rows={[writtenRow, writtenNotSubmittedRow, liveRow]}
        onClickDetail={onClickDetail}
      />,
    );

    const buttons = screen.getAllByRole('button', { name: '보기' });
    expect(buttons.length).toBe(2); // writtenRow + liveRow

    await userEvent.click(buttons[0]);
    expect(onClickDetail).toHaveBeenCalledWith(writtenRow);
  });

  it('rows가 비어있을 때 빈 메시지를 보여준다', () => {
    render(<FeedbackTable rows={[]} onClickDetail={() => undefined} />);
    expect(screen.getByText('표시할 피드백이 없습니다.')).toBeInTheDocument();
  });

  it('서면 / 라이브 행에 각각 다른 아이콘 라벨이 렌더된다', () => {
    render(
      <FeedbackTable
        rows={[writtenRow, liveRow]}
        onClickDetail={() => undefined}
      />,
    );
    expect(screen.getByLabelText('서면 피드백')).toBeInTheDocument();
    expect(screen.getByLabelText('라이브 피드백')).toBeInTheDocument();
  });
});
