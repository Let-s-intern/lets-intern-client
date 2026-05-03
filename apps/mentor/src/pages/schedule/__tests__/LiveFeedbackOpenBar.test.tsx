import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import LiveFeedbackOpenBar from '../calendar-bar/ui/LiveFeedbackOpenBar';
import LiveFeedbackCard, {
  LiveFeedbackTimeBlock,
} from '../calendar-bar/ui/LiveFeedbackCard';
import type { PeriodBarData } from '../types';

function makeBar(overrides: Partial<PeriodBarData> = {}): PeriodBarData {
  return {
    barType: 'live-feedback-mentor-open',
    challengeId: 1,
    missionId: 0,
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
    colorIndex: 0,
    ...overrides,
  };
}

describe('LiveFeedbackOpenBar (PRD-0503 #3 디자인)', () => {
  it('"LIVE 피드백 일정 오픈" 라벨과 챌린지명을 노출한다', () => {
    render(
      <LiveFeedbackOpenBar bar={makeBar()} onMentorOpenClick={() => {}} />,
    );

    expect(screen.getByText('LIVE')).toBeInTheDocument();
    expect(screen.getByText(/피드백 일정 오픈/)).toBeInTheDocument();
    expect(screen.getByText('포트폴리오 챌린지 7기')).toBeInTheDocument();
  });

  it('슬롯이 저장되지 않은 진행 상태에서는 "완료" 배지를 노출하지 않는다', () => {
    render(
      <LiveFeedbackOpenBar
        bar={makeBar({ completedCount: 0 })}
        onMentorOpenClick={() => {}}
      />,
    );

    expect(screen.queryByText('완료')).not.toBeInTheDocument();
  });

  it('completedCount > 0 이면 "완료" 배지를 노출한다', () => {
    render(
      <LiveFeedbackOpenBar
        bar={makeBar({ completedCount: 3 })}
        onMentorOpenClick={() => {}}
      />,
    );

    expect(screen.getByText('완료')).toBeInTheDocument();
  });

  it('기간 경과면 슬롯 미저장이어도 "완료"로 본다', () => {
    render(
      <LiveFeedbackOpenBar
        bar={makeBar({ endDate: '2000-01-01', completedCount: 0 })}
        onMentorOpenClick={() => {}}
      />,
    );

    expect(screen.getByText('완료')).toBeInTheDocument();
  });

  it('멘토 케이스 + onMentorOpenClick 이 주어지면 클릭 가능하다', () => {
    const onClick = vi.fn();
    render(<LiveFeedbackOpenBar bar={makeBar()} onMentorOpenClick={onClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});

describe('LiveFeedbackTimeBlock (PRD-0503 #3 디자인)', () => {
  function makeLiveBar(
    status?: PeriodBarData['liveFeedback'] extends infer T
      ? T extends { status?: infer S }
        ? S
        : never
      : never,
  ): PeriodBarData {
    return makeBar({
      barType: 'live-feedback',
      liveFeedback: {
        id: 1,
        menteeName: '김멋쟁',
        startTime: '15:30',
        endTime: '16:00',
        status,
      },
    });
  }

  it('시작시간 / LIVE 피드백 / 멘티명 / 챌린지명을 모두 렌더한다', () => {
    render(<LiveFeedbackTimeBlock bar={makeLiveBar('in-progress')} />);

    expect(screen.getByText('15:30')).toBeInTheDocument();
    expect(screen.getByText('LIVE')).toBeInTheDocument();
    expect(screen.getByText('피드백')).toBeInTheDocument();
    expect(screen.getByText('김멋쟁 멘티')).toBeInTheDocument();
    expect(screen.getByText('포트폴리오 챌린지 7기')).toBeInTheDocument();
  });

  it('진행중 상태 배지를 표시한다', () => {
    render(<LiveFeedbackTimeBlock bar={makeLiveBar('in-progress')} />);
    expect(screen.getByText('진행중')).toBeInTheDocument();
  });

  it('완료 상태 배지를 표시한다', () => {
    render(<LiveFeedbackTimeBlock bar={makeLiveBar('completed')} />);
    expect(screen.getByText('완료')).toBeInTheDocument();
  });

  it('대기 상태에서는 상태 배지를 표시하지 않는다', () => {
    render(<LiveFeedbackTimeBlock bar={makeLiveBar('waiting')} />);

    expect(screen.queryByText('진행중')).not.toBeInTheDocument();
    expect(screen.queryByText('완료')).not.toBeInTheDocument();
  });
});

describe('LiveFeedbackCard (single-day card, 디자인 미변경 영역 회귀)', () => {
  it('LIVE / 회차 / 멘티명 / 챌린지명을 렌더한다', () => {
    const bar = makeBar({
      barType: 'live-feedback',
      th: 2,
      liveFeedback: {
        id: 9,
        menteeName: '이멘티',
        startTime: '09:00',
        endTime: '09:30',
      },
    });
    render(<LiveFeedbackCard bar={bar} />);

    expect(screen.getByText('LIVE')).toBeInTheDocument();
    expect(screen.getByText('[ 2회차 ]')).toBeInTheDocument();
    expect(screen.getByText('이멘티님')).toBeInTheDocument();
    expect(screen.getByText('포트폴리오 챌린지 7기')).toBeInTheDocument();
  });
});
