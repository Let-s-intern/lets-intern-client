import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { ProgramCategoryGroup } from '../programCategoryApi';

vi.mock('@/hooks/useAdminSnackbar', () => ({
  useAdminSnackbar: () => ({ snackbar: vi.fn() }),
}));

const put = vi.fn(async () => ({}));
vi.mock('@/utils/axios', () => ({
  default: {
    get: vi.fn(
      async (url: string, config?: { params?: { programId?: number } }) => {
        if (url === '/admin/program-category/auto-tag/candidates')
          return {
            data: {
              data: {
                candidateList: [
                  // 제목에는 없지만 챌린지 구분으로 이력서
                  {
                    targetType: 'CHALLENGE',
                    targetId: 1,
                    title: '취업 챌린지 3기',
                    challengeType: 'CAREER_START',
                    tagIds: [],
                  },
                  // 이미 이력서가 있어 더할 게 없다
                  {
                    targetType: 'CHALLENGE',
                    targetId: 2,
                    title: '이력서 챌린지',
                    challengeType: 'CAREER_START',
                    tagIds: [10],
                  },
                  {
                    targetType: 'BLOG',
                    targetId: 7,
                    title: '취준 이야기',
                    blogTagNames: ['자소서'],
                    tagIds: [99],
                  },
                ],
              },
            },
          };
        if (url === '/admin/program-category/program')
          return {
            data: {
              data: {
                programCategoryIdList:
                  config?.params?.programId === 7 ? [99] : [],
              },
            },
          };
        throw new Error(url);
      },
    ),
    put: (...args: unknown[]) => put(...args),
  },
}));

import AutoFillPanel from './AutoFillPanel';

const groups: ProgramCategoryGroup[] = [
  {
    id: 1,
    title: '서류',
    sortOrder: 0,
    isVisible: true,
    purpose: 'FILTER',
    categoryList: [
      {
        id: 10,
        title: '이력서',
        sortOrder: 0,
        isVisible: true,
        programCount: 1,
        autoKeywords: ['이력서'],
      },
      {
        id: 11,
        title: '자기소개서',
        sortOrder: 1,
        isVisible: true,
        programCount: 0,
        autoKeywords: ['자소서'],
      },
    ],
  },
];

describe('자동 태그 채우기', () => {
  it('서버 후보로 더할 태그만 보이고(챌린지 구분 포함, 이미 있으면 뺌), 고른 것을 지금 태그에 더해 저장한다', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <AutoFillPanel groups={groups} />
      </QueryClientProvider>,
    );
    fireEvent.click(screen.getByRole('button', { name: '자동 태그 채우기' }));
    expect(await screen.findByText('취업 챌린지 3기')).toBeTruthy();
    expect(screen.getByText('챌린지 구분: 이력서')).toBeTruthy();
    expect(screen.queryByText('이력서 챌린지')).toBeNull();
    expect(screen.getByText('취준 이야기')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: '2개 더하기' }));
    await waitFor(() => expect(put).toHaveBeenCalledTimes(2));
    const bodies = put.mock.calls.map((c) => (c as unknown[])[1]);
    expect(bodies).toContainEqual({
      programType: 'CHALLENGE',
      programId: 1,
      programCategoryIdList: [10],
    });
    expect(bodies).toContainEqual({
      programType: 'BLOG',
      programId: 7,
      programCategoryIdList: [99, 11],
    });
  });
});
