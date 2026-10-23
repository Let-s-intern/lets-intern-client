import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import routerSource from '../../../router.tsx?raw';

const getV1 = vi.fn();
const getV2 = vi.fn();

vi.mock('@/utils/axios', () => ({
  default: { get: (...args: unknown[]) => getV1(...args) },
}));
vi.mock('@/utils/axiosV2', () => ({
  default: { get: (...args: unknown[]) => getV2(...args) },
}));

vi.mock('@/api/user/user', () => ({ useIsAdminQuery: vi.fn() }));

import { navData } from '../../AdminSidebar';
import SearchPanel from '../SearchPanel';
import { buildMenuEntries, buildSearchEntries } from '../searchEntries';
import type { SearchEntry } from '../searchEntries';
import { programDestinations } from '../useProgramSearch';

const program = (id: number, title: string, programType = 'CHALLENGE') => ({
  programInfo: {
    id,
    programType,
    programStatusType: 'PROCEEDING',
    title,
    startDate: '2026-01-05T00:00:00',
    endDate: '2026-02-01T23:59:59',
  },
  classificationList: [],
});

let programs: unknown[] = [];

const programCalls = () =>
  getV1.mock.calls.filter(([url]) => url === '/program/admin');

const renderPanel = (
  entries: SearchEntry[] = [],
  menuEntries: SearchEntry[] = entries,
) => {
  const onSelect = vi.fn();
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <SearchPanel
        entries={entries}
        menuEntries={menuEntries}
        focusSignal={1}
        onSelect={onSelect}
        onClose={vi.fn()}
      />
    </QueryClientProvider>,
  );
  return onSelect;
};

const input = () => screen.getByRole('combobox', { name: '메뉴 검색어' });
const type = (value: string) =>
  fireEvent.change(input(), { target: { value } });
/** 머리 줄. 강조 때문에 글자가 쪼개져 있어 textContent 로 본다 */
const programHeaders = () =>
  [...document.querySelectorAll('li[role="presentation"]')]
    .map((item) => item.textContent ?? '')
    .filter((text) => text.startsWith('['));
const optionLabels = () =>
  screen.getAllByRole('option').map((option) => option.firstChild?.textContent);

beforeEach(() => {
  programs = [];
  getV1.mockImplementation(() =>
    Promise.resolve({
      data: {
        data: {
          programList: programs,
          pageInfo: {
            pageNum: 1,
            pageSize: 8,
            totalElements: programs.length,
            totalPages: 1,
          },
        },
      },
    }),
  );
  getV2.mockImplementation((url: string) =>
    url === '/admin/user/mentor'
      ? Promise.resolve({ data: { data: { mentorList: [] } } })
      : Promise.reject(new Error('유저 검색은 이 테스트 대상이 아니다')),
  );
});

afterEach(() => vi.clearAllMocks());

describe('SearchPanel 프로그램 묶음', () => {
  it('2글자 이상, 멈춘 뒤 한 번만 유형 없이 keyword·size 8 로 묻는다', async () => {
    renderPanel();
    type('취');
    await new Promise((resolve) => setTimeout(resolve, 350));
    expect(programCalls()).toHaveLength(0);

    type('취업');
    type('취업 챌린지');
    expect(programCalls()).toHaveLength(0);
    await waitFor(() => expect(programCalls()).toHaveLength(1));
    expect(programCalls()[0][1].params).toEqual({
      keyword: '취업 챌린지',
      page: 1,
      size: 8,
    });
    expect(programCalls()[0][1].signal).toBeInstanceOf(AbortSignal);
  });

  it('오타 「첼린지」 는 고쳐서 keyword 「챌린지」 로 묻는다. 고칠 것이 없으면 친 그대로다', async () => {
    renderPanel();
    type('첼린지 3기');
    await waitFor(() => expect(programCalls()).toHaveLength(1));
    expect(programCalls()[0][1].params.keyword).toBe('챌린지 3기');

    type('현직자 세미나');
    await waitFor(() => expect(programCalls()).toHaveLength(2));
    expect(programCalls()[1][1].params.keyword).toBe('현직자 세미나');
  });

  it('찾는 동안 안내하고, 없으면 없다고 한다', async () => {
    renderPanel();
    type('없는프로그램');
    expect(screen.getByText('프로그램 찾는 중…')).toBeInTheDocument();
    expect(
      await screen.findByText('일치하는 프로그램이 없습니다'),
    ).toBeInTheDocument();
  });

  it('조회가 실패하면 알린다', async () => {
    getV1.mockImplementation(() => Promise.reject(new Error('500')));
    renderPanel();
    type('취업');
    expect(
      await screen.findByText('프로그램을 불러오지 못했습니다'),
    ).toBeInTheDocument();
  });

  it('챌린지는 「[챌린지] 제목」·#id·기간·상태와 운영 탭 전부를 포함한 갈 곳을 둔다', async () => {
    programs = [program(12, '취업 챌린지 3기')];
    renderPanel();
    type('취업');

    await waitFor(() =>
      expect(programHeaders()).toEqual([
        '[챌린지] 취업 챌린지 3기#12 · 26.01.05~26.02.01 · 모집 중',
      ]),
    );
    expect(optionLabels()).toEqual([
      '프로그램 수정',
      '홈',
      '미션등록',
      '제출확인',
      '참여자',
      '페이백',
      '피드백',
      '멘토 배정',
      '신청자 목록',
    ]);
  });

  it('「세미나」 로 LIVE 가 나오고, 수정·신청자 목록 둘을 둔다', async () => {
    programs = [program(5, '현직자 세미나', 'LIVE')];
    const onSelect = renderPanel();
    type('세미나');

    await waitFor(() =>
      expect(programHeaders()).toEqual([
        '[LIVE] 현직자 세미나#5 · 26.01.05~26.02.01 · 모집 중',
      ]),
    );
    expect(optionLabels()).toEqual(['프로그램 수정', '신청자 목록']);

    fireEvent.keyDown(input(), { key: 'ArrowDown' });
    fireEvent.keyDown(input(), { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ path: '/programs/5/users?programType=LIVE' }),
    );
  });

  it('VOD·가이드북은 라벨을 달고, 갈 화면이 없는 유형(서류 진단)은 뺀다', async () => {
    programs = [
      program(3, '취업 VOD', 'VOD'),
      program(3, '취업 가이드북', 'GUIDEBOOK'),
      program(9, '취업 서류 진단', 'REPORT'),
    ];
    renderPanel();
    type('취업');

    await waitFor(() =>
      expect(programHeaders().map((text) => text.split('#')[0])).toEqual([
        '[VOD] 취업 VOD',
        '[가이드북] 취업 가이드북',
      ]),
    );
  });

  it('「챌린지」 로 찾으면 챌린지 프로그램 결과가 와도 메뉴 묶음에 챌린지 관리 메뉴가 모두 남는다', async () => {
    programs = [program(12, '취업 챌린지 3기'), program(13, '마케팅 챌린지')];
    renderPanel(buildSearchEntries(navData), buildMenuEntries(navData));
    type('챌린지');
    await waitFor(() => expect(programHeaders()).toHaveLength(2));

    const menuOptions = screen
      .getAllByRole('option')
      .map((option) => option.lastChild?.textContent ?? '')
      .filter((path) => path.startsWith('챌린지 관리 › '));
    expect(menuOptions.slice(0, 6)).toEqual([
      '챌린지 관리 › 챌린지 운영',
      '챌린지 관리 › 콘텐츠 관리',
      '챌린지 관리 › 미션 관리',
      '챌린지 관리 › 전체 공지 관리',
      '챌린지 관리 › 피드백 운영',
      '챌린지 관리 › 1:1 문의',
    ]);
  });

  it('키보드로 챌린지 하위 항목을 골라 그 화면으로 간다', async () => {
    programs = [program(12, '취업 챌린지 3기')];
    const onSelect = renderPanel();
    type('취업');
    await waitFor(() => expect(programHeaders()).toHaveLength(1));

    fireEvent.keyDown(input(), { key: 'ArrowDown' });
    fireEvent.keyDown(input(), { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        label: '홈',
        path: '/challenge/operation/12/home',
        parents: ['챌린지 운영'],
      }),
    );
  });
});

/**
 * router.tsx 의 라우트 패턴. 상대 경로(자식 라우트)는 바로 앞의 절대 경로 아래에 붙인다.
 * 자식 배열이 끝난 뒤의 형제는 다시 절대 경로로 시작하므로 이 단순한 규칙으로 충분하다.
 */
const routePatterns = (() => {
  let parent = '';
  return [...routerSource.matchAll(/path:\s*'([^']+)'/g)].map(([, path]) => {
    if (path.startsWith('/')) {
      parent = path;
      return path;
    }
    return `${parent}/${path}`;
  });
})();

const matchesRoute = (path: string) =>
  routePatterns.some((pattern) =>
    new RegExp(`^${pattern.replace(/:[^/]+/g, '[^/]+')}$`).test(path),
  );

describe('programDestinations', () => {
  it.each(['CHALLENGE', 'LIVE', 'VOD', 'GUIDEBOOK'] as const)(
    '%s 의 갈 곳이 모두 router.tsx 의 파라미터 라우트와 맞는다',
    (type) => {
      const missing = programDestinations(type, 12)
        .map((entry) => entry.path.split('?')[0])
        .filter((path) => !matchesRoute(path));
      expect(missing).toEqual([]);
    },
  );

  it('패턴 검사가 없는 경로는 걸러 낸다', () => {
    expect(matchesRoute('/challenge/operation/12/home')).toBe(true);
    expect(matchesRoute('/challenge/operation/12/nope')).toBe(false);
    expect(matchesRoute('/live/12/operation')).toBe(false);
  });
});
