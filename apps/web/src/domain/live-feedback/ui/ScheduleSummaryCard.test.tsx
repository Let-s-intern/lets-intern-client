/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';

import ScheduleSummaryCard from './ScheduleSummaryCard';

describe('ScheduleSummaryCard', () => {
  it('isLoading이면 스켈레톤만 보이고 값 행은 없다', () => {
    render(
      <ScheduleSummaryCard counterpartLabel="멘토" role={null} isLoading />,
    );
    // placeholder 값('-') 이 표시되지 않아야 한다
    expect(screen.queryByText('프로그램')).not.toBeInTheDocument();
  });

  it('값이 있으면 프로그램/미션/상대방/일시를 표시한다', () => {
    render(
      <ScheduleSummaryCard
        programTitle="합격하는 자소서"
        missionLabel="3회차"
        counterpartLabel="멘티"
        counterpartName="김멘티"
        startDate="2026-06-13T10:00:00+09:00"
        endDate="2026-06-13T11:00:00+09:00"
        role="MENTOR"
      />,
    );
    expect(screen.getByText('합격하는 자소서')).toBeInTheDocument();
    expect(screen.getByText('3회차')).toBeInTheDocument();
    expect(screen.getByText('김멘티')).toBeInTheDocument();
    expect(screen.getByText('멘티')).toBeInTheDocument();
    expect(screen.getByText(/10:00 ~ 11:00/)).toBeInTheDocument();
  });

  it('일시 값은 한 줄 유지 스타일(whitespace-nowrap)을 가진다', () => {
    render(
      <ScheduleSummaryCard
        counterpartLabel="멘토"
        counterpartName="관리자"
        startDate="2026-07-22T17:30:00+09:00"
        endDate="2026-07-22T18:00:00+09:00"
        role="MENTEE"
      />,
    );

    const dateValue = screen.getByText(/17:30 ~ 18:00/);
    expect(dateValue).toHaveClass('whitespace-nowrap');
  });

  it('role이 null이면 역할 확인 안내를 보여준다', () => {
    render(
      <ScheduleSummaryCard
        counterpartLabel="멘토"
        startDate="2026-06-13T10:00:00+09:00"
        endDate="2026-06-13T11:00:00+09:00"
        role={null}
      />,
    );
    expect(screen.getByText(/역할 정보를 확인하는 중/)).toBeInTheDocument();
  });
});
