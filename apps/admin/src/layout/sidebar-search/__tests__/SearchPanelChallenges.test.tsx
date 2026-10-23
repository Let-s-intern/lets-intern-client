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

import SearchPanel from '../SearchPanel';
import { challengeDestinations } from '../useChallengeSearch';

const challenge = (id: number, title: string) => ({
  programInfo: {
    id,
    programType: 'CHALLENGE',
    programStatusType: 'PROCEEDING',
    title,
    startDate: '2026-01-05T00:00:00',
    endDate: '2026-02-01T23:59:59',
  },
  classificationList: [],
});

let challenges: unknown[] = [];

const challengeCalls = () =>
  getV1.mock.calls.filter(([url]) => url === '/program/admin');

const renderPanel = () => {
  const onSelect = vi.fn();
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <SearchPanel
        entries={[]}
        menuEntries={[]}
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
const challengeHeaders = () =>
  [...document.querySelectorAll('li[role="presentation"]')]
    .map((item) => item.textContent ?? '')
    .filter((text) => text.startsWith('[챌린지]'));
const optionLabels = () =>
  screen.getAllByRole('option').map((option) => option.firstChild?.textContent);

beforeEach(() => {
  challenges = [];
  getV1.mockImplementation(() =>
    Promise.resolve({
      data: {
        data: {
          programList: challenges,
          pageInfo: {
            pageNum: 1,
            pageSize: 5,
            totalElements: challenges.length,
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

describe('SearchPanel 챌린지 묶음', () => {
  it('2글자 이상, 멈춘 뒤 한 번만 type=CHALLENGE·keyword·size 5 로 묻는다', async () => {
    renderPanel();
    type('취');
    await new Promise((resolve) => setTimeout(resolve, 350));
    expect(challengeCalls()).toHaveLength(0);

    type('취업');
    type('취업 챌린지');
    expect(challengeCalls()).toHaveLength(0);
    await waitFor(() => expect(challengeCalls()).toHaveLength(1));
    expect(challengeCalls()[0][1].params).toEqual({
      type: 'CHALLENGE',
      keyword: '취업 챌린지',
      page: 1,
      size: 5,
    });
    expect(challengeCalls()[0][1].signal).toBeInstanceOf(AbortSignal);
  });

  it('찾는 동안 안내하고, 없으면 없다고 한다', async () => {
    renderPanel();
    type('없는챌린지');
    expect(screen.getByText('챌린지 찾는 중…')).toBeInTheDocument();
    expect(
      await screen.findByText('일치하는 챌린지가 없습니다'),
    ).toBeInTheDocument();
  });

  it('조회가 실패하면 알린다', async () => {
    getV1.mockImplementation(() => Promise.reject(new Error('500')));
    renderPanel();
    type('취업');
    expect(
      await screen.findByText('챌린지를 불러오지 못했습니다'),
    ).toBeInTheDocument();
  });

  it('「[챌린지] 제목」·#id·기간·상태를 보이고 갈 곳 7개를 하위 항목으로 둔다', async () => {
    challenges = [challenge(12, '취업 챌린지 3기')];
    renderPanel();
    type('취업');

    await waitFor(() =>
      expect(challengeHeaders()).toEqual([
        '[챌린지] 취업 챌린지 3기#12 · 26.01.05~26.02.01 · 모집 중',
      ]),
    );
    expect(optionLabels()).toEqual([
      '프로그램 수정',
      '대시보드',
      '출석·미션',
      '참여자',
      '피드백',
      '멘토 배정',
      '신청자 목록',
    ]);
  });

  it('키보드로 하위 항목을 골라 그 챌린지의 화면으로 간다', async () => {
    challenges = [challenge(12, '취업 챌린지 3기')];
    const onSelect = renderPanel();
    type('취업');
    await waitFor(() => expect(challengeHeaders()).toHaveLength(1));

    fireEvent.keyDown(input(), { key: 'ArrowDown' });
    fireEvent.keyDown(input(), { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        label: '대시보드',
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

describe('challengeDestinations', () => {
  it('모든 갈 곳이 router.tsx 의 파라미터 라우트와 맞는다', () => {
    const missing = challengeDestinations(12)
      .map((entry) => entry.path)
      .filter((path) => !matchesRoute(path));
    expect(missing).toEqual([]);
  });

  it('패턴 검사가 없는 경로는 걸러 낸다', () => {
    expect(matchesRoute('/challenge/operation/12/home')).toBe(true);
    expect(matchesRoute('/challenge/operation/12/nope')).toBe(false);
  });
});
