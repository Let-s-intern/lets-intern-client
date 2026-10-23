import { describe, expect, it, vi } from 'vitest';

import routerSource from '../../../router.tsx?raw';
import { buildSearchEntries } from '../searchEntries';

vi.mock('@/api/user/user', () => ({ useIsAdminQuery: vi.fn() }));

import { navData } from '../../AdminSidebar';

/** router.tsx 에 적힌 라우트 경로들 */
const routePaths = new Set(
  [...routerSource.matchAll(/path:\s*'([^']+)'/g)].map((match) => match[1]),
);

describe('buildSearchEntries', () => {
  it('사이드바 메뉴를 그대로 넣는다 — 메뉴 배열에 항목을 더하면 검색에도 나온다', () => {
    const entries = buildSearchEntries([
      {
        title: '새 그룹',
        itemList: [
          { name: '새 메뉴', url: '/new-menu' },
          { name: '바깥 링크', url: 'https://example.com', external: true },
        ],
      },
    ]);
    expect(entries).toContainEqual({
      label: '새 메뉴',
      path: '/new-menu',
      parents: ['새 그룹'],
      keywords: [],
    });
    // 외부 링크는 검색 대상이 아니다
    expect(entries.some((entry) => entry.path === 'https://example.com')).toBe(
      false,
    );
  });

  it('실제 사이드바 메뉴가 모두 들어 있다', () => {
    const paths = buildSearchEntries(navData).map((entry) => entry.path);
    const menuUrls = navData
      .flatMap((section) => section.itemList)
      .filter((item) => !('external' in item && item.external))
      .map((item) => item.url);
    expect(paths).toEqual(expect.arrayContaining(menuUrls));
  });

  it('모든 검색 주소가 router.tsx 에 있는 라우트다', () => {
    const missing = buildSearchEntries(navData)
      .map((entry) => entry.path.split('?')[0])
      .filter((path) => !routePaths.has(path));
    expect(missing).toEqual([]);
  });
});
