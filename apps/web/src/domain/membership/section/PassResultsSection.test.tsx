import { render, screen } from '@testing-library/react';

import { PASS_RESULTS } from '../data/passResults';
import PassResultsSection from './PassResultsSection';

describe('PassResultsSection (개편 시안 5)', () => {
  it('카드를 데이터 개수만큼 그린다', () => {
    const { container } = render(<PassResultsSection />);

    expect(container.querySelectorAll('li')).toHaveLength(
      PASS_RESULTS.cards.length,
    );
  });

  it('회사·직무·고용형태 배지가 카드마다 나온다', () => {
    render(<PassResultsSection />);

    for (const card of PASS_RESULTS.cards) {
      expect(screen.getByText(card.company)).toBeInTheDocument();
      expect(screen.getByText(card.role)).toBeInTheDocument();
    }
  });

  /*
   * 고용형태는 배지 모양이 정규직(채움)과 인턴류(테두리)로 갈린다. 시안에 있는 3종이
   * 모두 라벨 그대로 나오는지 못박아 둔다 — 새 사례를 넣을 때 오타로 넷째 값이 들어오면
   * 화면에서는 테두리 배지로 조용히 섞여 들어간다.
   */
  it('고용형태 배지 3종이 라벨 그대로 나온다', () => {
    render(<PassResultsSection />);

    for (const employment of ['정규직', '인턴', '전환형 인턴']) {
      expect(screen.getAllByText(employment).length).toBeGreaterThan(0);
    }
  });

  it('수강생 문구가 카드 수만큼, 하단 한 줄이 한 번 나온다', () => {
    render(<PassResultsSection />);

    expect(screen.getAllByText(PASS_RESULTS.studentNote)).toHaveLength(
      PASS_RESULTS.cards.length,
    );
    expect(screen.getByText(PASS_RESULTS.footnote)).toBeInTheDocument();
  });
});
