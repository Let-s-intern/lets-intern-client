import { render } from '@testing-library/react';

import BigfirmPage from './BigfirmPage';

jest.mock('./data/mentorImages', () => ({
  getMentorImages: async () => ({}),
}));

// 히어로 애니메이션이 matchMedia 를 읽는다. jsdom 에는 없다.
beforeAll(() => {
  window.matchMedia = jest.fn().mockReturnValue({
    matches: true,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  });
});

async function renderPage() {
  const { container } = render(await BigfirmPage());
  return container;
}

function tracked(container: HTMLElement, location: string, target: string) {
  return container.querySelectorAll(
    `[data-track-location="${location}"][data-track-target="${target}"]`,
  );
}

describe('BigfirmPage 클릭 추적 속성', () => {
  it.each([
    ['hero', 'find_mentor'],
    ['hero', 'mentoring_list'],
    ['coupon', 'coupon_copy'],
    ['reviews', 'review_list'],
    ['faq', 'inquiry'],
    ['bottom_cta', 'find_mentor'],
    ['floating_bar', 'inquiry'],
    ['floating_bar', 'mentoring_list'],
  ])('%s / %s 버튼이 하나 있다', async (location, target) => {
    const container = await renderPage();

    expect(tracked(container, location, target)).toHaveLength(1);
  });

  it('기업 탭 버튼마다 탭 키가 붙는다', async () => {
    const container = await renderPage();
    const tabs = tracked(container, 'mentor_finder', 'company_tab');

    expect(
      Array.from(tabs).map((tab) => tab.getAttribute('data-track-tab')),
    ).toEqual(['all', 'top100', 'nklcb']);
  });

  it.each(['mentor_finder', 'reviews'])(
    '%s 의 멘토 상세 링크마다 멘토 id 가 붙고 주소와 맞는다',
    async (location) => {
      const container = await renderPage();
      const links = Array.from(tracked(container, location, 'mentor_detail'));

      expect(links.length).toBeGreaterThan(0);
      links.forEach((link) => {
        const mentorId = link.getAttribute('data-track-mentor-id');
        expect(mentorId).toMatch(/^\d+$/);
        expect(link.getAttribute('href')).toBe(`/live-mentoring/${mentorId}`);
      });
    },
  );

  it('클릭 추적기를 그린다 (클릭 시 dataLayer 에 남는다)', async () => {
    window.dataLayer = [];
    const container = await renderPage();

    (tracked(container, 'faq', 'inquiry')[0] as HTMLElement).click();

    expect(window.dataLayer).toEqual([
      expect.objectContaining({
        event: 'bigfirm_click',
        button_location: 'faq',
      }),
    ]);
  });
});
