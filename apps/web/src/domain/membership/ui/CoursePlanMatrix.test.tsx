import { render, screen } from '@testing-library/react';
import CoursePlanMatrix from './CoursePlanMatrix';
import { CATEGORIES, MATRIX_CELLS } from '../data/coursePlan';

const PROVIDED_COUNT = MATRIX_CELLS.filter((c) => c.owner !== 'self').length;

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

  it('멤버십 제공 셀에만 "멤버십 제공" 태그를 표시하고 직접 셀엔 태그가 없다', () => {
    render(<CoursePlanMatrix />);
    // 제공 셀 수만큼의 스티커 + 하단 안내 칩 1개 = PROVIDED_COUNT + 1.
    expect(screen.getAllByText('멤버십 제공')).toHaveLength(PROVIDED_COUNT + 1);
    // 직접 태그는 더 이상 렌더하지 않는다.
    expect(screen.queryByText('직접')).not.toBeInTheDocument();
  });
});
