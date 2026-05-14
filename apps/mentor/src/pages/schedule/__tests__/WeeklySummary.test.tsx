import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import WeeklySummary from '../ui/WeeklySummary';

describe('WeeklySummary', () => {
  it('전체 / 오늘마감 / 미완료 / 진행상황 라벨과 카운트를 렌더한다', () => {
    render(
      <WeeklySummary
        totalCount={10}
        todayDueCount={3}
        incompleteCount={4}
        completedCount={5}
      />,
    );

    expect(screen.getByText('전체')).toBeInTheDocument();
    expect(screen.getByText('오늘마감')).toBeInTheDocument();
    expect(screen.getByText('미완료')).toBeInTheDocument();
    expect(screen.getByText('진행상황')).toBeInTheDocument();

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    // 5/10 = 50%
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('totalCount 가 0 이면 진행률은 0% 로 표시된다', () => {
    render(
      <WeeklySummary
        totalCount={0}
        todayDueCount={0}
        incompleteCount={0}
        completedCount={0}
      />,
    );

    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('completedCount === totalCount 면 100% 로 표시된다', () => {
    render(
      <WeeklySummary
        totalCount={4}
        todayDueCount={0}
        incompleteCount={0}
        completedCount={4}
      />,
    );

    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});
