import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import WrittenFeedbackBar from '../calendar-bar/ui/WrittenFeedbackBar';
import type { PeriodBarData } from '../types';

function makeBar(overrides: Partial<PeriodBarData> = {}): PeriodBarData {
  return {
    barType: 'written-feedback',
    challengeId: 1,
    missionId: 10,
    challengeTitle: '포트폴리오 챌린지 7기',
    th: 1,
    startDate: '2099-01-01',
    endDate: '2099-01-07',
    feedbackStartDate: '2099-01-01',
    feedbackDeadline: '2099-01-07',
    submittedCount: 0,
    notSubmittedCount: 0,
    waitingCount: 0,
    inProgressCount: 0,
    completedCount: 0,
    ...overrides,
  };
}

describe('WrittenFeedbackBar (PRD-0503 #3 디자인)', () => {
  it('"서면 피드백 기간" 라벨과 챌린지명을 노출한다', () => {
    render(<WrittenFeedbackBar bar={makeBar()} onBarClick={() => {}} />);

    expect(screen.getByText('서면 피드백 기간')).toBeInTheDocument();
    expect(screen.getByText('포트폴리오 챌린지 7기')).toBeInTheDocument();
  });

  it('진행 중(완료 아님)이면 "완료" 배지를 노출하지 않는다', () => {
    render(
      <WrittenFeedbackBar
        bar={makeBar({ submittedCount: 5, completedCount: 2 })}
        onBarClick={() => {}}
      />,
    );

    expect(screen.queryByText('완료')).not.toBeInTheDocument();
  });

  it('모든 제출자에게 피드백을 작성하면 "완료" 배지를 노출한다', () => {
    render(
      <WrittenFeedbackBar
        bar={makeBar({ submittedCount: 5, completedCount: 5 })}
        onBarClick={() => {}}
      />,
    );

    expect(screen.getByText('완료')).toBeInTheDocument();
  });

  it('제출자 0 + 기간 경과면 "완료" 배지를 노출한다', () => {
    render(
      <WrittenFeedbackBar
        bar={makeBar({
          endDate: '2000-01-01',
          submittedCount: 0,
          completedCount: 0,
        })}
        onBarClick={() => {}}
      />,
    );

    expect(screen.getByText('완료')).toBeInTheDocument();
  });

  it('클릭 시 onBarClick(challengeId, missionId)이 호출된다', () => {
    const onBarClick = vi.fn();
    render(
      <WrittenFeedbackBar
        bar={makeBar({ challengeId: 7, missionId: 99 })}
        onBarClick={onBarClick}
      />,
    );

    fireEvent.click(screen.getByRole('button'));

    expect(onBarClick).toHaveBeenCalledWith(7, 99);
  });

  it('버튼에 rounded-sm 클래스가 적용된다', () => {
    render(<WrittenFeedbackBar bar={makeBar()} onBarClick={() => {}} />);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('rounded-sm');
  });
});
