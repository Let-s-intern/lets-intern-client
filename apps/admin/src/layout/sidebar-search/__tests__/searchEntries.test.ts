import { describe, expect, it, vi } from 'vitest';

import routerSource from '../../../router.tsx?raw';
import { matchEntries } from '../matchEntries';
import { CHALLENGE_OPERATION_TABS } from '../../../pages/challenge/ui/challengeOperationTabs';
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

  it('「벌크」 로 회사 로고 › 일괄 등록 탭을 찾는다', () => {
    const [first] = matchEntries(buildSearchEntries(navData), '벌크');
    expect(first).toMatchObject({
      label: '일괄 등록',
      path: '/mentors/company-logos?tab=bulk',
      parents: ['멘토 관리', '회사 로고'],
    });
  });

  it('「프로그램 개설」 상단 등록 버튼 넷을 「프로그램 관리 › 프로그램 개설 › …」 로 찾는다', () => {
    const entries = buildSearchEntries(navData);
    expect(matchEntries(entries, '등록').map((entry) => entry.path)).toEqual(
      expect.arrayContaining([
        '/challenge/create',
        '/live/create',
        '/vod/create',
        '/guidebook/create',
      ]),
    );
    expect(matchEntries(entries, '라이브클래스')[0]).toMatchObject({
      label: 'LIVE 클래스 등록',
      path: '/live/create',
      parents: ['프로그램 관리', '프로그램 개설'],
    });
    expect(matchEntries(entries, '챌린지 만들기')[0]).toMatchObject({
      label: '챌린지 등록',
      path: '/challenge/create',
    });
  });

  it('「챌린지」 로 챌린지 관리 섹션 메뉴가 모두 나온다', () => {
    const labels = matchEntries(buildSearchEntries(navData), '챌린지')
      .filter(
        (entry) =>
          entry.parents.length === 1 && entry.parents[0] === '챌린지 관리',
      )
      .map((entry) => entry.label);
    expect(labels).toEqual([
      '챌린지 운영',
      '콘텐츠 관리',
      '미션 관리',
      '전체 공지 관리',
      '피드백 운영',
      '1:1 문의',
    ]);
  });

  it('챌린지 운영 화면의 탭을 화면 라벨 그대로 「챌린지 관리 › 챌린지 운영 › …」 로 찾고, /challenge/operation?tab= 으로 보낸다', () => {
    const entries = buildSearchEntries(navData).filter(
      (entry) => entry.parents.join('/') === '챌린지 관리/챌린지 운영',
    );
    expect(entries.map((entry) => entry.label)).toEqual(
      CHALLENGE_OPERATION_TABS.map((tab) => tab.text),
    );
    expect(entries.map((entry) => entry.path)).toEqual(
      CHALLENGE_OPERATION_TABS.map(
        (tab) => `/challenge/operation?tab=${tab.id}`,
      ),
    );
    expect(
      matchEntries(buildSearchEntries(navData), '제출 관리')[0],
    ).toMatchObject({
      label: '제출확인',
      path: '/challenge/operation?tab=attendances',
      parents: ['챌린지 관리', '챌린지 운영'],
    });
  });

  it('오타 「첼린지」·「첼린저」 로도 챌린지 관리 메뉴와 챌린지 운영 탭을 찾는다', () => {
    const entries = buildSearchEntries(navData);
    const expected = matchEntries(entries, '챌린지');
    expect(matchEntries(entries, '첼린지')).toEqual(expected);
    expect(matchEntries(entries, '첼린저')).toEqual(expected);
    expect(
      matchEntries(entries, '첼린지 운영').map((entry) =>
        [...entry.parents, entry.label].join(' › '),
      ),
    ).toEqual(
      expect.arrayContaining([
        '챌린지 관리 › 챌린지 운영',
        '챌린지 관리 › 챌린지 운영 › 제출확인',
      ]),
    );
  });

  it('「브이오디」·「라이브 클래스」 로 등록 버튼을 찾는다', () => {
    const entries = buildSearchEntries(navData);
    expect(matchEntries(entries, '브이오디 등록')[0]).toMatchObject({
      label: 'VOD 클래스 등록',
    });
    expect(matchEntries(entries, '라이브 클래스')[0]).toMatchObject({
      label: 'LIVE 클래스 등록',
    });
  });

  it('챌린지 운영 탭마다 router.tsx 에 자식 라우트가 있다', () => {
    const missing = CHALLENGE_OPERATION_TABS.filter(
      (tab) => !routePaths.has(tab.id),
    ).map((tab) => tab.id);
    expect(missing).toEqual([]);
  });
});
