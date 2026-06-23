import { render, screen } from '@testing-library/react';
import CoursePlanMatrix from './CoursePlanMatrix';
import { CATEGORIES, COURSE_TAG_LABEL, MATRIX_CELLS } from '../data/coursePlan';

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

  it('모든 셀에 분류 배지를 표시한다(태그별 = 셀 수 + 하단 범례 1)', () => {
    render(<CoursePlanMatrix />);
    for (const [tag, label] of Object.entries(COURSE_TAG_LABEL)) {
      const cellCount = MATRIX_CELLS.filter((c) => c.tag === tag).length;
      expect(screen.getAllByText(label)).toHaveLength(cellCount + 1);
    }
    // 옛 "멤버십 제공" 스티커는 더 이상 렌더하지 않는다.
    expect(screen.queryByText('멤버십 제공')).not.toBeInTheDocument();
  });
});
