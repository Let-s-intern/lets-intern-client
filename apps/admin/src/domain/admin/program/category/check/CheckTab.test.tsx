import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ProgramCategoryGroup } from '../programCategoryApi';

vi.mock('@/hooks/useAdminSnackbar', () => ({
  useAdminSnackbar: () => ({ snackbar: vi.fn() }),
}));

const landing = {
  page: {
    id: 10,
    title: '이력서',
    slug: 'resume',
    heroTitle: null,
    heroDescription: null,
  },
  sectionList: [
    {
      id: 100,
      title: '대표 챌린지',
      description: null,
      displayType: 'FEATURED',
      targetList: [
        {
          targetType: 'CHALLENGE',
          targetId: 7,
          title: '이력서 완성 챌린지',
          categoryIds: [10],
          mergedTargetIds: [7],
        },
      ],
    },
    {
      id: 101,
      title: '블로그',
      description: null,
      displayType: 'CARDS',
      targetList: [],
    },
  ],
};

// 점검 탭이 읽는 전체 상품 후보. 테스트마다 바꾼다
let candidateList: Record<string, unknown>[] = [];

vi.mock('@/utils/axios', () => ({
  default: {
    get: vi.fn(async (url: string) => {
      if (url === '/admin/program-category/landing/resume')
        return { data: { data: landing } };
      if (url === '/admin/program-category/landing/secret')
        return {
          data: {
            data: {
              ...landing,
              page: { ...landing.page, id: 11, title: '숨긴', slug: 'secret' },
              sectionList: [landing.sectionList[0]],
            },
          },
        };
      if (url === '/admin/program-category/auto-tag/candidates')
        return { data: { data: { candidateList } } };
      if (url === '/program-category/targets')
        return {
          data: {
            data: {
              targetList: [
                {
                  targetType: 'CHALLENGE',
                  targetId: 7,
                  title: '이력서 완성 챌린지',
                  categoryIds: [10],
                },
              ],
            },
          },
        };
      throw new Error(`unexpected ${url}`);
    }),
    post: vi.fn(),
  },
}));

import CheckTab from './CheckTab';

const groups: ProgramCategoryGroup[] = [
  {
    id: 1,
    title: '서류',
    sortOrder: 0,
    isVisible: true,
    purpose: 'FILTER',
    placements: [{ placementType: 'PROGRAM_FILTER' }],
    categoryList: [
      {
        id: 10,
        title: '이력서',
        sortOrder: 0,
        isVisible: true,
        programCount: 1,
        slug: 'resume',
      },
    ],
  },
];

const renderTab = (tabGroups: ProgramCategoryGroup[] = groups) =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <CheckTab groups={tabGroups} />
    </QueryClientProvider>,
  );

describe('점검 탭', () => {
  beforeEach(() => {
    candidateList = [];
  });

  it('상품별 노출 위치에서 랜딩 위치를 누르면 그 페이지를 열고 상품과 섹션을 짚는다', async () => {
    renderTab();
    fireEvent.click(
      await screen.findByRole('button', {
        name: '/category/resume 1. 대표 챌린지',
      }),
    );

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('/category/resume 페이지')).toBeTruthy();
    expect(await within(dialog).findByText('이 상품')).toBeTruthy();
    expect(dialog.querySelector('[data-highlight="target"]')).not.toBeNull();
    expect(dialog.querySelector('[data-highlight="section"]')).not.toBeNull();
  });

  it('상품이 없는 섹션을 누르면 그 섹션을 짚어 연다', async () => {
    renderTab();
    fireEvent.click(await screen.findByText('/category/resume 2. 블로그'));

    const dialog = await screen.findByRole('dialog');
    const marked = await within(dialog).findByText('블로그', {
      selector: 'h2',
    });
    expect(marked.closest('[data-highlight="section"]')).not.toBeNull();
    expect(within(dialog).queryByText('이 상품')).toBeNull();
  });

  it('어드민 조회로 랜딩이 오는 숨긴 분류는 섹션이 없는 분류 페이지로 내지 않고, 404 인 분류만 낸다', async () => {
    const tag = (
      id: number,
      title: string,
      slug: string,
      isVisible: boolean,
    ) => ({
      id,
      title,
      sortOrder: id,
      isVisible,
      programCount: 1,
      slug,
    });
    renderTab([
      {
        ...groups[0],
        categoryList: [
          tag(10, '이력서', 'resume', true),
          tag(11, '숨긴', 'secret', false),
          tag(12, '빈', 'empty', true),
        ],
      },
    ]);

    expect(await screen.findByText('빈 · /category/empty')).toBeTruthy();
    expect(screen.queryByText('숨긴 · /category/secret')).toBeNull();
    expect(screen.queryByText('이력서 · /category/resume')).toBeNull();
  });

  describe('노출인데 사이트에 안 나오는 상품', () => {
    const TITLE = '노출인데 사이트에 안 나오는 상품';
    const candidate = (over: Record<string, unknown>) => ({
      targetType: 'CHALLENGE',
      targetId: 1,
      title: '상품',
      isVisible: true,
      endDate: null,
      tagIds: [],
      ...over,
    });

    it('노출이고 위치가 없는 상품을 이유와 함께 내고, 위치가 있거나 노출이 꺼진 상품은 내지 않는다', async () => {
      candidateList = [
        // 필터에 노출 위치가 있다
        candidate({ targetId: 7, title: '이력서 완성 챌린지', tagIds: [10] }),
        candidate({ targetId: 8, title: '태그 없는 챌린지' }),
        candidate({
          targetType: 'VOD',
          targetId: 9,
          title: '숨긴 분류에만 붙은 VOD',
          tagIds: [99],
        }),
        candidate({
          targetId: 10,
          title: '노출 꺼진 챌린지',
          isVisible: false,
        }),
      ];
      renderTab();

      expect(await screen.findByText(TITLE)).toBeTruthy();
      expect(
        await screen.findByText(/태그 없는 챌린지 · 챌린지 · 태그 없음/),
      ).toBeTruthy();
      expect(
        screen.getByText(
          /숨긴 분류에만 붙은 VOD · VOD 클래스 · 붙은 분류가 모두 숨김이거나 노출 자리가 없음/,
        ),
      ).toBeTruthy();
      expect(screen.queryByText(/노출 꺼진 챌린지/)).toBeNull();
      expect(screen.queryByText(/이력서 완성 챌린지 · 챌린지 ·/)).toBeNull();
    });

    it('종료된 상품은 기본으로 안 나오고, 종료된 상품도 보기를 켜면 나온다', async () => {
      candidateList = [
        candidate({
          targetId: 11,
          title: '끝난 챌린지',
          endDate: '2020-01-01T00:00:00',
        }),
        candidate({
          targetId: 12,
          title: '진행 챌린지',
          endDate: '2999-01-01T00:00:00',
        }),
      ];
      renderTab();

      expect(await screen.findByText(/진행 챌린지 · 챌린지/)).toBeTruthy();
      expect(screen.queryByText(/끝난 챌린지/)).toBeNull();

      fireEvent.click(screen.getByLabelText('종료된 상품도 보기'));
      expect(await screen.findByText(/끝난 챌린지 · 챌린지/)).toBeTruthy();
    });

    it('줄을 누르면 유형별 수정 화면을 새 탭으로 연다', async () => {
      candidateList = [
        candidate({ targetId: 1, title: '챌린지A' }),
        candidate({ targetType: 'LIVE', targetId: 2, title: '라이브B' }),
        candidate({ targetType: 'VOD', targetId: 3, title: '브이오디C' }),
        candidate({ targetType: 'GUIDEBOOK', targetId: 4, title: '가이드D' }),
        candidate({ targetType: 'MEMBERSHIP', targetId: 5, title: '패스E' }),
      ];
      renderTab();

      const href = async (name: RegExp) => {
        const link = await screen.findByRole('link', { name });
        expect(link.getAttribute('target')).toBe('_blank');
        return link.getAttribute('href');
      };
      expect(await href(/챌린지A/)).toBe('/challenge/1/edit');
      expect(await href(/라이브B/)).toBe('/live/2/edit');
      expect(await href(/브이오디C/)).toBe('/vod/3/edit');
      expect(await href(/가이드D/)).toBe('/guidebook/4/edit');
      expect(await href(/패스E/)).toBe('/all-in-one-pass/5/edit');
    });

    it('서버가 노출 여부를 아직 안 주는 옛 응답이면 묶음을 그리지 않는다', async () => {
      candidateList = [
        {
          targetType: 'CHALLENGE',
          targetId: 8,
          title: '태그 없는 챌린지',
          tagIds: [],
        },
      ];
      renderTab();

      // 다른 묶음은 그려졌고 이 묶음만 없다
      expect(await screen.findByText('상품이 없는 섹션')).toBeTruthy();
      await new Promise((resolve) => setTimeout(resolve, 50));
      expect(screen.queryByText(TITLE)).toBeNull();
    });

    it('노출 위치가 있거나 점검 대상이 아니면 없음으로 보인다', async () => {
      candidateList = [
        candidate({ targetId: 7, title: '이력서 완성 챌린지', tagIds: [10] }),
        candidate({ targetType: 'MAGNET', targetId: 20, title: '마그넷' }),
      ];
      renderTab();

      const title = await screen.findByText(TITLE);
      await waitFor(() =>
        expect(title.parentElement!.textContent).toContain('없음'),
      );
    });
  });
});
