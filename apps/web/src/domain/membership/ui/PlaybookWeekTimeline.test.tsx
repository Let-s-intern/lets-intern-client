import { render, screen } from '@testing-library/react';

import { PLAYBOOK_OUTPUT } from '../data/playbookDashboard';
import PlaybookWeekTimeline from './PlaybookWeekTimeline';

const cards = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('article'));

describe('PlaybookWeekTimeline (개편 시안 10 OUTPUT)', () => {
  it('WEEK 01~10 카드 10장을 순서대로 그린다', () => {
    const { container } = render(<PlaybookWeekTimeline />);

    const labels = cards(container).map(
      (card) => card.querySelector('span')?.textContent,
    );
    expect(labels).toEqual([
      'WEEK 01',
      'WEEK 02',
      'WEEK 03',
      'WEEK 04',
      'WEEK 05',
      'WEEK 06',
      'WEEK 07',
      'WEEK 08',
      'WEEK 09',
      'WEEK 10',
    ]);
  });

  it('산출물 제목과 설명을 모두 그린다', () => {
    render(<PlaybookWeekTimeline />);

    for (const item of PLAYBOOK_OUTPUT.weeks) {
      expect(screen.getByText(item.title)).toBeInTheDocument();
      expect(screen.getByText(item.desc)).toBeInTheDocument();
    }
  });

  /*
   * 챌린지는 1~3주차에만 함께 돈다. 배지가 4주차 이후에도 붙으면 챌린지가 10주 내내
   * 있는 것으로 읽힌다.
   */
  it('「챌린지 기간」 배지는 WEEK 01~03 에만 붙는다', () => {
    const { container } = render(<PlaybookWeekTimeline />);

    const badged = cards(container).map((card) =>
      card.textContent?.includes('챌린지 기간'),
    );
    expect(badged).toEqual([
      true,
      true,
      true,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
    ]);
  });

  it('남색 채움 카드는 마지막 주차 한 장뿐이다', () => {
    const { container } = render(<PlaybookWeekTimeline />);

    const filled = cards(container).filter((card) =>
      card.className.includes('bg-[#11142B]'),
    );
    expect(filled).toHaveLength(1);
    expect(filled[0].textContent).toContain('WEEK 10');
  });
});
