import { render, screen } from '@testing-library/react';
import CoursePlanTimeline from './CoursePlanTimeline';
import { MONTH_GROUPS, WEEKS } from '../data/coursePlan';

describe('CoursePlanTimeline', () => {
  it('12개 주차 카드를 모두 렌더한다(12·13 묶음 포함)', () => {
    render(<CoursePlanTimeline />);
    expect(screen.getAllByText('WEEK')).toHaveLength(WEEKS.length);
    expect(WEEKS).toHaveLength(12);
  });

  it('각 월 그룹의 영문명·타이틀·서브·배지를 렌더한다', () => {
    render(<CoursePlanTimeline />);
    for (const group of MONTH_GROUPS) {
      expect(screen.getByText(group.month)).toBeInTheDocument();
      expect(screen.getByText(group.title)).toBeInTheDocument();
      expect(screen.getByText(group.sub)).toBeInTheDocument();
      expect(screen.getByText(group.badge)).toBeInTheDocument();
    }
  });

  it('첫 주차(01)와 마지막 묶음 주차(12·13)를 표시한다', () => {
    render(<CoursePlanTimeline />);
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('12·13')).toBeInTheDocument();
  });
});
