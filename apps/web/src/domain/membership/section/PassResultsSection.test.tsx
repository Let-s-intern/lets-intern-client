import { render, screen } from '@testing-library/react';

import { PASS_RESULTS } from '../data/passResults';
import PassResultsSection from './PassResultsSection';

describe('PassResultsSection (개편 시안 5)', () => {
  /*
   * 끊김 없이 흐르려면 같은 목록이 두 벌 있어야 한다. 둘째 벌은 눈에만 보이는 복사본이라
   * `aria-hidden` 이다 — 화면 낭독기에 같은 사례를 두 번 읽히면 안 된다.
   */
  it('카드를 두 벌 그리고 둘째 벌만 aria-hidden 이다', () => {
    const { container } = render(<PassResultsSection />);

    const items = container.querySelectorAll('li');
    expect(items).toHaveLength(PASS_RESULTS.cards.length * 2);

    const hidden = container.querySelectorAll('li[aria-hidden="true"]');
    expect(hidden).toHaveLength(PASS_RESULTS.cards.length);
  });

  it('회사·직무·고용형태 배지가 카드마다 나온다', () => {
    const { container } = render(<PassResultsSection />);

    // 첫 벌(낭독기에 읽히는 쪽)만 본다
    const visible = container.querySelectorAll('li[aria-hidden="false"]');
    expect(visible).toHaveLength(PASS_RESULTS.cards.length);

    PASS_RESULTS.cards.forEach((card, index) => {
      expect(visible[index]).toHaveTextContent(card.company);
      expect(visible[index]).toHaveTextContent(card.role);
    });
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

  it('수강생 문구가 카드마다, 하단 한 줄이 한 번 나온다', () => {
    render(<PassResultsSection />);

    expect(screen.getAllByText(PASS_RESULTS.studentNote)).toHaveLength(
      PASS_RESULTS.cards.length * 2,
    );
    expect(screen.getByText(PASS_RESULTS.footnote)).toBeInTheDocument();
  });
});
