import { render, screen } from '@testing-library/react';

import { RECOMMEND } from '../data/recommend';
import RecommendSection from './RecommendSection';

describe('RecommendSection (시안 2)', () => {
  it('고민 카드 3장의 제목이 보인다', () => {
    render(<RecommendSection />);

    expect(RECOMMEND.cards).toHaveLength(3);
    for (const card of RECOMMEND.cards) {
      expect(screen.getByText(card.title)).toBeInTheDocument();
    }
  });

  it('번호 배지를 그린다', () => {
    render(<RecommendSection />);
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
  });
});
