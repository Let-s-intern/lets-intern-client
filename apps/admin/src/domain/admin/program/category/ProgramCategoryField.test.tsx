import { act, fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { calls, resolvers, savedIds } = vi.hoisted(() => ({
  calls: [] as number[][],
  resolvers: [] as (() => void)[],
  // react-query 처럼 같은 배열을 돌려준다. 매번 새 배열이면 동기화 effect 가 끝없이 돈다
  savedIds: [] as number[],
}));

vi.mock('./hooks/useProductSearch', () => ({
  useProductSearch: () => ({ data: undefined }),
}));

vi.mock('@/hooks/useAdminSnackbar', () => ({
  useAdminSnackbar: () => ({ snackbar: vi.fn() }),
}));

vi.mock('./programCategoryApi', () => ({
  useAdminProgramCategoryGroupsQuery: () => ({
    data: [
      {
        id: 1,
        title: '관심 직무',
        sortOrder: 0,
        isVisible: true,
        categoryList: [
          {
            id: 10,
            title: '마케팅',
            sortOrder: 0,
            isVisible: true,
            programCount: 0,
            autoKeywords: ['마케팅'],
          },
          {
            id: 11,
            title: 'PM',
            sortOrder: 1,
            isVisible: true,
            programCount: 0,
          },
          {
            id: 12,
            title: 'HR',
            sortOrder: 2,
            isVisible: true,
            programCount: 0,
          },
        ],
      },
    ],
  }),
  useProgramCategoryIdsQuery: () => ({ data: savedIds }),
  // 저장은 손으로 끝내기 전까지 걸려 있다
  usePutProgramCategoriesOfTarget: () => ({
    mutateAsync: (ids: number[]) => {
      calls.push(ids);
      return new Promise<void>((resolve) => resolvers.push(resolve));
    },
  }),
}));

import ProgramCategoryField from './ProgramCategoryField';

const finishSave = async () => {
  await act(async () => {
    resolvers.shift()?.();
  });
};

describe('ProgramCategoryField 연타', () => {
  beforeEach(() => {
    calls.length = 0;
    resolvers.length = 0;
  });

  it('저장 중에 여러 번 눌러도 요청은 하나씩 나가고, 마지막 상태가 최종 저장된다', async () => {
    render(<ProgramCategoryField targetType="CHALLENGE" targetId={1} />);
    fireEvent.click(screen.getByRole('button', { name: '수정' }));

    fireEvent.click(screen.getByLabelText('마케팅'));
    fireEvent.click(screen.getByLabelText('PM'));
    fireEvent.click(screen.getByLabelText('HR'));
    fireEvent.click(screen.getByLabelText('PM'));

    // 화면은 바로 바뀐다
    expect(screen.getByLabelText('마케팅')).toBeChecked();
    expect(screen.getByLabelText('PM')).not.toBeChecked();
    expect(screen.getByLabelText('HR')).toBeChecked();
    // 첫 요청만 나가 있다
    expect(calls).toEqual([[10]]);

    await finishSave();
    // 그사이 바뀐 것 중 마지막 상태 하나만 이어서 보낸다
    expect(calls).toEqual([[10], [10, 12]]);

    await finishSave();
    expect(calls).toHaveLength(2);
  });

  it('수정 화면이 넘긴 한 줄 설명으로 추천 태그를 낸다', () => {
    render(
      <ProgramCategoryField
        targetType="LIVE"
        targetId={1}
        autoTagInput={{ title: '취업 특강', description: '마케팅 직무 소개' }}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: '태그 자동 추천' }));

    expect(screen.getByRole('button', { name: /\+ 마케팅/ })).toBeTruthy();
    expect(screen.getByText("설명에 '마케팅'")).toBeTruthy();
  });
});
