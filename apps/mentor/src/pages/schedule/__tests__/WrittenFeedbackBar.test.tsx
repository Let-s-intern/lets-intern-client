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
  it('"N회차 서면 피드백 기간" 라벨(미션 회차 노출)과 챌린지명을 노출한다', () => {
    render(<WrittenFeedbackBar bar={makeBar()} onBarClick={() => {}} />);

    expect(screen.getByText('1회차 서면 피드백 기간')).toBeInTheDocument();
    expect(screen.getByText('포트폴리오 챌린지 7기')).toBeInTheDocument();
  });

  it('2줄 보조정보(남은 피드백 · 완료/제출)를 노출한다', () => {
    const { container } = render(
      <WrittenFeedbackBar
        bar={makeBar({ submittedCount: 7, completedCount: 5 })}
        onBarClick={() => {}}
      />,
    );

    // 남은 피드백 = 제출(7) - 완료(5) = 2
    expect(container.textContent).toContain('남은 피드백 2건');
    expect(container.textContent).toContain('완료 5 / 제출 7');
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

  it('버튼에 rounded(4px) 클래스가 적용된다', () => {
    render(<WrittenFeedbackBar bar={makeBar()} onBarClick={() => {}} />);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('rounded');
  });
});
