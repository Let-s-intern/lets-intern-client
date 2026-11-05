const mockFetchJson = jest.fn();
jest.mock('@letscareer/api', () => ({
  fetchJson: (...args: unknown[]) => mockFetchJson(...args),
}));

import sitemap from './sitemap';

describe('sitemap', () => {
  const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://www.letscareer.co.kr';
    mockFetchJson.mockImplementation(
      async (_url: string, init: { parse: (data: unknown) => unknown }) =>
        init.parse({
          magnetList: [
            { id: 59, title: '렛츠콘 자료집', lastModifiedDate: null },
          ],
          blogList: [
            {
              id: 10,
              title: '자소서 쓰는 법',
              lastModifiedDate: '2026-11-01T10:00:00',
            },
          ],
          programList: [
            {
              programType: 'CHALLENGE',
              id: 3,
              title: '마케팅 챌린지',
              lastModifiedDate: null,
            },
          ],
        }),
    );
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
  });

  it('서버가 고른 마그넷·블로그·프로그램 상세를 사이트 주소 규칙대로 넣는다', async () => {
    const urls = (await sitemap()).map((entry) => entry.url);

    expect(urls).toEqual(
      expect.arrayContaining([
        'https://www.letscareer.co.kr/library/list',
        `https://www.letscareer.co.kr/library/59/${encodeURIComponent('렛츠콘-자료집')}`,
        `https://www.letscareer.co.kr/blog/10/${encodeURIComponent('자소서-쓰는-법')}`,
        `https://www.letscareer.co.kr/program/challenge/3/${encodeURIComponent('마케팅-챌린지')}`,
      ]),
    );
  });

  it('수정일이 있으면 lastModified 로 넣는다', async () => {
    const blog = (await sitemap()).find((entry) =>
      entry.url.includes('/blog/10/'),
    );

    expect(blog?.lastModified).toEqual(new Date('2026-11-01T10:00:00'));
  });
});
