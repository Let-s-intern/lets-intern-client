import { render, screen } from '@testing-library/react';
import { SOLUTION } from '../data/solution';
import SolutionSection from './SolutionSection';

describe('SolutionSection', () => {
  it('배지와 헤드라인 2줄을 렌더하고 강조 어절을 파란색(.hl)으로 감싼다', () => {
    const { container } = render(<SolutionSection />);
    expect(screen.getByText(SOLUTION.badge)).toBeInTheDocument();
    expect(container.querySelector('.sec-head h2')?.textContent).toBe(
      SOLUTION.titleLines.join(''),
    );
    expect(container.querySelector('.sec-head h2 .hl')?.textContent).toBe(
      SOLUTION.titleHighlight,
    );
  });

  it('좌우 위성 카드 5장의 제목과 설명을 모두 렌더한다', () => {
    const { container } = render(<SolutionSection />);
    expect(container.querySelectorAll('.hub .hub-sat')).toHaveLength(5);
    for (const sat of SOLUTION.satellites) {
      expect(screen.getByText(sat.label)).toBeInTheDocument();
      expect(screen.getByText(sat.hint)).toBeInTheDocument();
    }
  });

  it('중앙 허브 박스 문구를 렌더한다', () => {
    const { container } = render(<SolutionSection />);
    expect(container.querySelector('.hub-core-title')?.textContent).toBe(
      SOLUTION.hubTitleLines.join(''),
    );
    expect(screen.getByText(SOLUTION.hubSub)).toBeInTheDocument();
  });

  it('다이어그램 하단 서브카피 2줄을 렌더한다', () => {
    const { container } = render(<SolutionSection />);
    expect(container.querySelector('.hub-note')?.textContent).toBe(
      SOLUTION.subLines.join(''),
    );
  });
});
