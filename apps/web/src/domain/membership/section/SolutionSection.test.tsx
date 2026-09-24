import { render, screen } from '@testing-library/react';

import { SOLUTION } from '../data/solution';
import SolutionSection from './SolutionSection';

describe('SolutionSection (시안 5)', () => {
  it('결과물 카드 3장의 라벨이 보인다', () => {
    render(<SolutionSection />);

    expect(SOLUTION.cards).toHaveLength(3);
    expect(screen.getByText('01 EXPERIENCE')).toBeInTheDocument();
    expect(screen.getByText('02 DOCUMENTS')).toBeInTheDocument();
    expect(screen.getByText('03 STRATEGY')).toBeInTheDocument();
  });

  /* 하단 밴드가 이 섹션의 결론이다. 빠지면 3카드가 무엇을 위한 것인지 사라진다. */
  it('하단 강조 밴드를 그린다', () => {
    render(<SolutionSection />);
    expect(screen.getByText(SOLUTION.bandMain)).toBeInTheDocument();
  });
});
