import { render, screen } from '@testing-library/react';
import CoursePlanTimeline from './CoursePlanTimeline';
import { MONTH_GROUPS, WEEKS } from '../data/coursePlan';

describe('CoursePlanTimeline', () => {
  it('13개 주차 항목을 모두 렌더한다', () => {
    render(<CoursePlanTimeline />);
    expect(screen.getAllByRole('listitem')).toHaveLength(13);
  });

  it('각 월 그룹과 성격 라벨을 렌더한다', () => {
    render(<CoursePlanTimeline />);
    for (const group of MONTH_GROUPS) {
      expect(screen.getByText(group.month)).toBeInTheDocument();
      expect(screen.getByText(group.trait)).toBeInTheDocument();
    }
  });

  it('주차 번호가 01~13 으로 0 패딩되어 표시된다', () => {
    render(<CoursePlanTimeline />);
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('13')).toBeInTheDocument();
    // 데이터의 주차 수와 렌더된 항목 수가 일치
    expect(WEEKS).toHaveLength(13);
  });
});
