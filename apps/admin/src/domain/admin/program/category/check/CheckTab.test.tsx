import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
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
});
