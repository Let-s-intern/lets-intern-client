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

  it('2줄 보조정보(D-day · 예약 가능 멘티)를 노출한다', () => {
    const { container } = render(
      <LiveFeedbackOpenBar
        bar={makeBar({ notSubmittedCount: 7 })}
        onMentorOpenClick={() => {}}
      />,
    );

    expect(container.textContent).toContain('예약 가능 멘티 7');
    expect(container.textContent).toMatch(/D-\d+|D-DAY|진행 중/);
  });

  it('멘토 케이스 + onMentorOpenClick 이 주어지면 클릭 가능하다', () => {
    const onClick = vi.fn();
    render(<LiveFeedbackOpenBar bar={makeBar()} onMentorOpenClick={onClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });

  it('버튼에 rounded(4px) 클래스가 적용된다', () => {
    render(
      <LiveFeedbackOpenBar bar={makeBar()} onMentorOpenClick={() => {}} />,
    );
    expect(screen.getByRole('button').className).toContain('rounded');
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
    expect(screen.getByText('1회차 LIVE 피드백')).toBeInTheDocument();
    expect(screen.getByText('김멋쟁 멘티')).toBeInTheDocument();
    expect(screen.getByText('포트폴리오 챌린지 7기')).toBeInTheDocument();
  });

  it('진행 중 상태 배지를 표시한다', () => {
    render(<LiveFeedbackTimeBlock bar={makeLiveBar('in-progress')} />);
    expect(screen.getByText('진행 중')).toBeInTheDocument();
  });

  it('진행 완료 상태 배지를 표시한다', () => {
    render(<LiveFeedbackTimeBlock bar={makeLiveBar('completed')} />);
    expect(screen.getByText('진행 완료')).toBeInTheDocument();
  });

  it('대기(waiting) 상태에서는 "진행 예정" 배지를 표시한다', () => {
    render(<LiveFeedbackTimeBlock bar={makeLiveBar('waiting')} />);
    expect(screen.getByText('진행 예정')).toBeInTheDocument();
  });

  it('상태가 없으면(undefined) "진행 예정" 배지를 표시한다', () => {
    render(<LiveFeedbackTimeBlock bar={makeLiveBar(undefined)} />);
    expect(screen.getByText('진행 예정')).toBeInTheDocument();
  });

  it('취소(cancelled) 상태는 "미진행" 배지를 표시한다', () => {
    render(<LiveFeedbackTimeBlock bar={makeLiveBar('cancelled')} />);
    expect(screen.getByText('미진행')).toBeInTheDocument();
  });

  it('취소(미진행) 배지는 연빨강 톤 색상을 가진다', () => {
    render(<LiveFeedbackTimeBlock bar={makeLiveBar('cancelled')} />);
    const badge = screen.getByText('미진행');
    expect(badge.className).toContain('bg-red-50');
    expect(badge.className).toContain('text-red-500');
  });

  it('진행 중 배지는 보라(primary) 톤 색상을 가진다', () => {
    render(<LiveFeedbackTimeBlock bar={makeLiveBar('in-progress')} />);
    const badge = screen.getByText('진행 중');
    expect(badge.className).toContain('bg-primary-5');
    expect(badge.className).toContain('text-primary');
  });

  it('진행 완료 배지는 회색 아웃라인 톤 색상을 가진다', () => {
    render(<LiveFeedbackTimeBlock bar={makeLiveBar('completed')} />);
    const badge = screen.getByText('진행 완료');
    expect(badge.className).toContain('bg-white');
    expect(badge.className).toContain('text-neutral-500');
  });

  it('우하단 ⋮(케밥) 메뉴를 표시한다', () => {
    const { container } = render(
      <LiveFeedbackTimeBlock bar={makeLiveBar('in-progress')} />,
    );
    // 케밥 = 세로 점 3개(circle 3개)
    expect(container.querySelectorAll('circle').length).toBeGreaterThanOrEqual(
      3,
    );
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
