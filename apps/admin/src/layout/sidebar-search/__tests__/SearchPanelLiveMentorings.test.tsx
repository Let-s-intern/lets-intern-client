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

import SearchPanel from '../SearchPanel';
import {
  liveMentoringDestinations,
  MAX_LIVE_MENTORINGS,
} from '../useLiveMentoringSearch';

const liveMentoring = (
  liveMentoringId: number,
  title: string,
  overrides: Record<string, unknown> = {},
) => ({
  liveMentoringId,
  mentorId: 900 + liveMentoringId,
  mentorNickname: '커리어코치',
  mentorProfileImage: null,
  title,
  thumbnail: null,
  status: 'APPROVED',
  categories: ['RESUME'],
  hasDetailPage: true,
  createDate: '2026-11-01T00:00:00',
  lastModifiedDate: '2026-11-02T00:00:00',
  currentOpening: null,
  upcomingParticipantCount: 0,
  mentorReviewCount: 0,
  ...overrides,
});

const openOpening = {
  openingId: 1,
  status: 'OPEN',
  durationPrices: [{ duration: 30, price: 35000 }],
  openedAt: '2026-11-01T00:00:00',
  closedAt: null,
  closeReason: null,
  closedByUserId: null,
  createDate: '2026-11-01T00:00:00',
  lastModifiedDate: '2026-11-01T00:00:00',
};

const pageInfo = { pageNum: 0, pageSize: 5, totalElements: 0, totalPages: 1 };

let products: unknown[] = [];
let failList = false;

const listCalls = () =>
  getV1.mock.calls.filter(([url]) => url === '/admin/live-mentoring');

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
/** 1:1 멘토링 머리 줄. 강조 때문에 글자가 쪼개져 있어 textContent 로 본다 */
const headers = () =>
  [...document.querySelectorAll('li[data-group="live-mentoring"]')].map(
    (item) => item.textContent ?? '',
  );
const notes = () =>
  [...document.querySelectorAll('li[role="presentation"]')].map(
    (item) => item.textContent ?? '',
  );

beforeEach(() => {
  products = [];
  failList = false;
  getV1.mockImplementation((url: string) => {
    if (url === '/admin/live-mentoring') {
      return failList
        ? Promise.reject(new Error('목록 실패'))
        : Promise.resolve({
            data: {
              data: { liveMentoringList: products, pageInfo },
            },
          });
    }
    if (url === '/admin/magnet') {
      return Promise.resolve({ data: { data: { magnetList: [] } } });
    }
    // 프로그램 묶음은 이 테스트 대상이 아니다
    return Promise.resolve({
      data: { data: { programList: [], pageInfo } },
    });
  });
  getV2.mockImplementation((url: string) =>
    url === '/admin/user/mentor'
      ? Promise.resolve({ data: { data: { mentorList: [] } } })
      : Promise.reject(new Error('유저 검색은 이 테스트 대상이 아니다')),
  );
});

afterEach(() => vi.clearAllMocks());

describe('SearchPanel 1:1 멘토링 묶음', () => {
  it('2글자 이상, 멈춘 뒤 한 번만 keyword 로 묻는다', async () => {
    renderPanel();
    type('멘');
    await new Promise((resolve) => setTimeout(resolve, 350));
    expect(listCalls()).toHaveLength(0);

    type('이력서');
    type('이력서 첨삭');
    expect(listCalls()).toHaveLength(0);
    await waitFor(() => expect(listCalls()).toHaveLength(1));
    expect(listCalls()[0][1].params).toEqual({
      keyword: '이력서 첨삭',
      page: 1,
      size: MAX_LIVE_MENTORINGS,
    });
    expect(listCalls()[0][1].signal).toBeInstanceOf(AbortSignal);
  });

  it('흔한 오타는 고쳐서 묻는다', async () => {
    renderPanel();
    type('첼린지');
    await waitFor(() => expect(listCalls()).toHaveLength(1));
    expect(listCalls()[0][1].params.keyword).toBe('챌린지');
  });

  it('머리 줄에 제목·id·멘토 닉네임·상태를 보여 준다', async () => {
    products = [
      liveMentoring(5, '이력서 첨삭', { currentOpening: openOpening }),
      liveMentoring(6, '면접 코칭', { status: 'INACTIVE' }),
    ];
    renderPanel();
    type('코칭');
    await waitFor(() => expect(headers()).toHaveLength(2));
    expect(headers()).toEqual([
      '[1:1 멘토링] 이력서 첨삭#5 · 커리어코치 · 개설 중',
      '[1:1 멘토링] 면접 코칭#6 · 커리어코치 · 비활성',
    ]);
  });

  it(`결과는 서버 순서대로 ${MAX_LIVE_MENTORINGS}건까지만 보인다`, async () => {
    products = Array.from({ length: 8 }, (_, i) =>
      liveMentoring(100 - i, `멘토링 ${i}`),
    );
    renderPanel();
    type('멘토링');
    await waitFor(() => expect(headers()).toHaveLength(MAX_LIVE_MENTORINGS));
    expect(headers()[0]).toContain('#100');
  });

  it('찾는 중·실패·없음 안내를 보여 준다', async () => {
    renderPanel();
    type('없는멘토링');
    expect(notes()).toContain('1:1 멘토링 찾는 중…');
    await waitFor(() =>
      expect(notes()).toContain('일치하는 1:1 멘토링이 없습니다'),
    );

    failList = true;
    type('실패할검색');
    await waitFor(() =>
      expect(notes()).toContain('1:1 멘토링을 불러오지 못했습니다'),
    );
  });

  it('키보드로 참여자를 골라 그 멘토의 참여자 탭 주소로 간다', async () => {
    products = [liveMentoring(7, '포트폴리오 리뷰')];
    const onSelect = renderPanel();
    type('포트폴리오');
    await waitFor(() => expect(headers()).toHaveLength(1));

    fireEvent.keyDown(input(), { key: 'ArrowDown' });
    fireEvent.keyDown(input(), { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        label: '참여자',
        path: '/live-mentoring?tab=participants&mentorId=907',
      }),
    );
  });
});

/** SearchPanelPrograms.test.tsx 와 같은 규칙으로 router.tsx 의 라우트 패턴을 읽는다 */
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

describe('liveMentoringDestinations', () => {
  it('상품 관리·참여자·후기·상세페이지 네 곳이다', () => {
    expect(liveMentoringDestinations(3).map((e) => e.label)).toEqual([
      '상품 관리',
      '참여자',
      '후기',
      '상세페이지',
    ]);
  });

  it('참여자·후기·상세페이지는 멘토 id 를 넘기고, 모든 경로가 router.tsx 에 있다', () => {
    const destinations = liveMentoringDestinations(3);
    expect(destinations.slice(1).map((e) => e.path)).toEqual([
      '/live-mentoring?tab=participants&mentorId=3',
      '/live-mentoring?tab=reviews&mentorId=3',
      '/live-mentoring?tab=detailPage&mentorId=3',
    ]);
    destinations.forEach((destination) =>
      expect(matchesRoute(destination.path.split('?')[0])).toBe(true),
    );
  });
});
