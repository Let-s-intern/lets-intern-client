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
import { MAX_MAGNETS, magnetDestinations } from '../useMagnetSearch';

const magnet = (
  magnetId: number,
  title: string,
  type = 'MATERIAL',
  isVisible = true,
) => ({
  magnetId,
  type,
  programType: null,
  challengeType: null,
  title,
  startDate: '2026-11-01T00:00:00',
  endDate: '2026-11-30T23:59:59',
  isVisible,
  isAccessible: true,
  applicationCount: 3,
});

const magnetDetail = (magnetId: number, title: string, type = 'MATERIAL') => ({
  magnetInfo: {
    ...magnet(magnetId, title, type),
    description: null,
    previewContents: null,
    mainContents: null,
    desktopThumbnail: null,
    mobileThumbnail: null,
    useBaseQuestion: false,
    useLaunchAlert: false,
  },
  magnetQuestionInfo: [],
});

let magnets: unknown[] = [];
let detailById: Record<number, unknown> = {};
let failList = false;

const magnetListCalls = () =>
  getV1.mock.calls.filter(([url]) => url === '/admin/magnet');
const magnetDetailCalls = () =>
  getV1.mock.calls.filter(([url]) => String(url).startsWith('/admin/magnet/'));

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
/** 마그넷 머리 줄. 강조 때문에 글자가 쪼개져 있어 textContent 로 본다 */
const magnetHeaders = () =>
  [...document.querySelectorAll('li[data-group="magnet"]')].map(
    (item) => item.textContent ?? '',
  );
const notes = () =>
  [...document.querySelectorAll('li[role="presentation"]')].map(
    (item) => item.textContent ?? '',
  );

beforeEach(() => {
  magnets = [];
  detailById = {};
  failList = false;
  getV1.mockImplementation((url: string) => {
    if (url === '/admin/magnet') {
      return failList
        ? Promise.reject(new Error('목록 실패'))
        : Promise.resolve({ data: { data: { magnetList: magnets } } });
    }
    const id = Number(String(url).replace('/admin/magnet/', ''));
    if (String(url).startsWith('/admin/magnet/')) {
      return detailById[id]
        ? Promise.resolve({ data: { data: detailById[id] } })
        : Promise.reject(new Error('MAGNET_NOT_FOUND'));
    }
    // 프로그램 묶음은 이 테스트 대상이 아니다
    return Promise.resolve({
      data: {
        data: {
          programList: [],
          pageInfo: {
            pageNum: 1,
            pageSize: 8,
            totalElements: 0,
            totalPages: 1,
          },
        },
      },
    });
  });
  getV2.mockImplementation((url: string) =>
    url === '/admin/user/mentor'
      ? Promise.resolve({ data: { data: { mentorList: [] } } })
      : Promise.reject(new Error('유저 검색은 이 테스트 대상이 아니다')),
  );
});

afterEach(() => vi.clearAllMocks());

describe('SearchPanel 마그넷 묶음', () => {
  it('2글자 이상, 멈춘 뒤 한 번만 keyword 로 묻는다', async () => {
    renderPanel();
    type('자');
    await new Promise((resolve) => setTimeout(resolve, 350));
    expect(magnetListCalls()).toHaveLength(0);

    type('자소서');
    type('자소서 템플릿');
    expect(magnetListCalls()).toHaveLength(0);
    await waitFor(() => expect(magnetListCalls()).toHaveLength(1));
    expect(magnetListCalls()[0][1].params).toEqual({
      keyword: '자소서 템플릿',
    });
    expect(magnetListCalls()[0][1].signal).toBeInstanceOf(AbortSignal);
  });

  it('흔한 오타는 고쳐서 묻는다', async () => {
    renderPanel();
    type('첼린지');
    await waitFor(() => expect(magnetListCalls()).toHaveLength(1));
    expect(magnetListCalls()[0][1].params.keyword).toBe('챌린지');
  });

  it('머리 줄에 유형·제목·id·노출 기간·노출 여부를 보여 준다', async () => {
    magnets = [magnet(59, '렛츠콘 온라인 신청', 'EVENT', false)];
    renderPanel();
    type('렛츠콘');
    await waitFor(() => expect(magnetHeaders()).toHaveLength(1));
    expect(magnetHeaders()[0]).toBe(
      '[이벤트] 렛츠콘 온라인 신청#59 · 26.11.01~26.11.30 · 비노출',
    );
  });

  it(`결과는 서버 순서대로 ${MAX_MAGNETS}건까지만 보인다`, async () => {
    magnets = Array.from({ length: 8 }, (_, i) =>
      magnet(100 - i, `자료집 ${i}`),
    );
    renderPanel();
    type('자료집');
    await waitFor(() => expect(magnetHeaders()).toHaveLength(MAX_MAGNETS));
    expect(magnetHeaders()[0]).toContain('#100');
  });

  it('찾는 중·실패·없음 안내를 보여 준다', async () => {
    renderPanel();
    type('없는마그넷');
    expect(notes()).toContain('마그넷 찾는 중…');
    await waitFor(() =>
      expect(notes()).toContain('일치하는 마그넷이 없습니다'),
    );

    failList = true;
    type('실패할검색');
    await waitFor(() =>
      expect(notes()).toContain('마그넷을 불러오지 못했습니다'),
    );
  });

  it('숫자만 치면 그 id 의 마그넷을 단건 조회해 맨 앞에 붙인다', async () => {
    magnets = [magnet(5900, '5959 합격 자료집'), magnet(59, '중복 렛츠콘')];
    detailById = { 59: magnetDetail(59, '중복 렛츠콘', 'EVENT') };
    renderPanel();
    type('59');
    await waitFor(() => expect(magnetHeaders()).toHaveLength(2));
    expect(magnetDetailCalls()[0][0]).toBe('/admin/magnet/59');
    expect(magnetHeaders()[0]).toContain('#59');
    expect(magnetHeaders()[1]).toContain('#5900');
  });

  it('없는 id 는 실패가 아니라 제목 결과만 보인다', async () => {
    magnets = [];
    renderPanel();
    type('12345');
    await waitFor(() =>
      expect(notes()).toContain('일치하는 마그넷이 없습니다'),
    );
    expect(notes()).not.toContain('마그넷을 불러오지 못했습니다');
  });

  it('키보드로 마그넷 하위 항목을 골라 그 주소로 간다', async () => {
    magnets = [magnet(7, '포트폴리오 템플릿', 'FREE_TEMPLATE')];
    const onSelect = renderPanel();
    type('포트폴리오');
    await waitFor(() => expect(magnetHeaders()).toHaveLength(1));

    fireEvent.keyDown(input(), { key: 'ArrowDown' });
    fireEvent.keyDown(input(), { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        label: '신청 폼 관리',
        path: '/magnet/7/form',
      }),
    );
  });

  it('placeholder 에 마그넷 검색이 보인다', () => {
    renderPanel();
    expect(input().getAttribute('placeholder')).toContain('마그넷');
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

describe('magnetDestinations', () => {
  it('자료집은 글 관리·신청 폼 관리·신청자 정보 세 곳이다', () => {
    expect(magnetDestinations('MATERIAL', 3).map((e) => e.label)).toEqual([
      '글 관리',
      '신청 폼 관리',
      '신청자 정보',
    ]);
  });

  it('이벤트는 신청 폼 관리가 없다', () => {
    expect(magnetDestinations('EVENT', 3).map((e) => e.label)).toEqual([
      '글 관리',
      '신청자 정보',
    ]);
  });

  it.each([
    'MATERIAL',
    'VOD',
    'FREE_TEMPLATE',
    'LAUNCH_ALERT',
    'EVENT',
  ] as const)('%s 의 갈 곳이 모두 router.tsx 라우트와 맞는다', (magnetType) => {
    const missing = magnetDestinations(magnetType, 12)
      .map((entry) => entry.path)
      .filter((path) => !matchesRoute(path));
    expect(missing).toEqual([]);
  });
});
