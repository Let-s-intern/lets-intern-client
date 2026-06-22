import { render, screen } from '@testing-library/react';
import CoursePlanMatrix from './CoursePlanMatrix';
import { CATEGORIES, MATRIX_CELLS } from '../data/coursePlan';

describe('CoursePlanMatrix', () => {
  it('모든 카테고리 라벨을 렌더한다', () => {
    render(<CoursePlanMatrix />);
    for (const category of CATEGORIES) {
      expect(screen.getByText(category.label)).toBeInTheDocument();
    }
  });

  it('모든 셀의 과업 제목을 렌더한다(31셀)', () => {
    render(<CoursePlanMatrix />);
    expect(MATRIX_CELLS).toHaveLength(31);
    for (const cell of MATRIX_CELLS) {
      expect(screen.getByText(cell.title)).toBeInTheDocument();
    }
  });

  it('챌린지·심화 owner 태그를 표시한다', () => {
    render(<CoursePlanMatrix />);
    // 챌린지 계열 셀이 존재하므로 강조 태그가 렌더된다.
    expect(screen.getAllByText('챌린지').length).toBeGreaterThan(0);
    expect(screen.getByText('챌린지 · 심화')).toBeInTheDocument();
  });
});
