import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ProgramCategoryGroup } from '../../programCategoryApi';
import TagLandingPreview from './TagLandingPreview';

vi.mock('@/utils/axios', () => ({
  default: {
    get: vi.fn(async (url: string) => {
      if (url.startsWith('/program-category/landing/')) throw new Error('404');
      if (url === '/program-category/targets')
        return {
          data: {
            data: {
              targetList: [
                {
                  targetType: 'CHALLENGE',
                  targetId: 1,
                  title: '예전 챌린지',
                  categoryIds: [30],
                },
              ],
            },
          },
        };
      throw new Error(url);
    }),
  },
}));

const tag = {
  id: 10,
  title: '이력서',
  sortOrder: 0,
  isVisible: true,
  programCount: 0,
  slug: 'resume',
};
const groups: ProgramCategoryGroup[] = [
  {
    id: 1,
    title: '서류',
    sortOrder: 0,
    isVisible: true,
    purpose: 'FILTER',
    categoryList: [tag],
  },
  {
    id: 2,
    title: '이력서 랜딩',
    sortOrder: 1,
    isVisible: true,
    purpose: 'LANDING',
    placements: [{ placementType: 'LANDING', slug: 'resume' }],
    categoryList: [
      {
        id: 30,
        title: '예전 섹션',
        sortOrder: 0,
        isVisible: true,
        programCount: 1,
      },
    ],
  },
];

describe('태그 미리보기', () => {
  it('태그에 섹션이 없으면 예전 랜딩을 대신 그린다 (웹과 같은 대체)', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <TagLandingPreview tag={tag} groups={groups} />
      </QueryClientProvider>,
    );
    expect(await screen.findByText(/사이트에는 예전 랜딩/)).toBeTruthy();
    expect(await screen.findByText('예전 섹션')).toBeTruthy();
    expect(await screen.findByText('예전 챌린지')).toBeTruthy();
  });
});
