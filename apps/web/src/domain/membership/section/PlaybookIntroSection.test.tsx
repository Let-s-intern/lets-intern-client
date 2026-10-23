import { render, screen } from '@testing-library/react';

import { PLAYBOOK_INTRO } from '../data/playbookIntro';
import PlaybookIntroSection from './PlaybookIntroSection';

describe('PlaybookIntroSection (개편 시안 8)', () => {
  it('잠금 배지와 제목 2줄, 설명 2줄을 그린다', () => {
    render(<PlaybookIntroSection />);

    expect(screen.getByText(PLAYBOOK_INTRO.badge)).toBeInTheDocument();
    for (const line of PLAYBOOK_INTRO.titleLines) {
      expect(screen.getByText(line)).toBeInTheDocument();
    }
    for (const line of PLAYBOOK_INTRO.descLines) {
      expect(screen.getByText(line.strong)).toBeInTheDocument();
    }
  });

  /*
   * 칩 순서가 곧 한 주를 보내는 순서다. 개수만 세면 순서가 섞여도 통과하므로
   * 화면에 그려진 차례 그대로 비교한다.
   */
  it('흐름 칩이 6개이고 시안 순서를 지킨다', () => {
    render(<PlaybookIntroSection />);

    const chips = screen
      .getAllByRole('listitem')
      .map((item) => item.textContent?.replace('→', '').trim());

    expect(chips).toEqual([
      '이번 주 해야 할 일',
      '필요한 자료',
      '참여할 챌린지 · 세미나',
      '확인할 채용공고',
      '만들어야 할 결과물',
      '나의 진행 상황',
    ]);
    expect(chips).toEqual([...PLAYBOOK_INTRO.chips]);
  });

  it('하단 한 줄의 강조 어절을 그린다', () => {
    render(<PlaybookIntroSection />);

    expect(screen.getByText(PLAYBOOK_INTRO.footer.strong)).toBeInTheDocument();
  });
});
