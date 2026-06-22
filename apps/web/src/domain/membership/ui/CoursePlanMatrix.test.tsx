import { render, screen } from '@testing-library/react';
import CoursePlanMatrix from './CoursePlanMatrix';
import {
  CATEGORIES,
  MATRIX_CELLS,
  STEPS,
} from '../data/coursePlan';

describe('CoursePlanMatrix', () => {
  it('모든 단계(STEP) 헤더를 렌더한다', () => {
    render(<CoursePlanMatrix />);
    for (const step of STEPS) {
      expect(screen.getByText(`STEP ${step.no}`)).toBeInTheDocument();
      expect(screen.getByText(step.label)).toBeInTheDocument();
    }
  });

  it('모든 카테고리 행 헤더를 렌더한다', () => {
    render(<CoursePlanMatrix />);
    for (const category of CATEGORIES) {
      expect(screen.getByText(category.label)).toBeInTheDocument();
    }
  });

  it('과업이 있는 셀의 owner 라벨을 표시한다', () => {
    render(<CoursePlanMatrix />);
    // 챌린지 owner 셀이 존재하므로 "챌린지" 라벨이 한 번 이상 렌더된다.
    const hasChallengeCell = MATRIX_CELLS.some(
      (cell) => cell.owner === 'challenge',
    );
    expect(hasChallengeCell).toBe(true);
    expect(screen.getAllByText('챌린지').length).toBeGreaterThan(0);
  });

  it('5×6 = 30개의 셀(role="cell")을 렌더한다', () => {
    render(<CoursePlanMatrix />);
    expect(screen.getAllByRole('cell')).toHaveLength(30);
  });
});
