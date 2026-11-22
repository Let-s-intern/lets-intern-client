import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./programCategoryApi', () => ({
  useAdminProgramCategoryGroupsQuery: () => ({
    data: [
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
            programCount: 0,
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
    ],
  }),
}));

import ProgramCategoryDraftField from './ProgramCategoryDraftField';
import ProgramCategoryPicker from './ProgramCategoryPicker';

let latest: number[] = [];
const Draft = ({ title }: { title: string }) => {
  const [value, setValue] = useState<number[]>([]);
  latest = value;
  return (
    <ProgramCategoryDraftField
      value={value}
      onChange={setValue}
      autoTagInput={{ title }}
    />
  );
};

describe('추천 태그', () => {
  it('새 상품도 추천 태그를 저절로 체크하지 않고, 버튼을 눌러야 추천이 보인다', () => {
    render(<Draft title="이력서 완성 챌린지" />);
    expect(latest).toEqual([]);
    expect(screen.queryByRole('button', { name: /\+ 이력서/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '태그 자동 추천' }));
    fireEvent.click(screen.getByRole('button', { name: /\+ 이력서/ }));
    expect(latest).toEqual([10]);
  });

  it('있는 상품은 추천 칩을 누르면 더하고, 고른 태그는 빼지 않는다', () => {
    const onToggle = vi.fn();
    render(
      <ProgramCategoryPicker
        selectedIds={[11]}
        onToggle={onToggle}
        note=""
        autoTagInput={{ title: '이력서 클래스' }}
      />,
    );
    expect(screen.queryByRole('button', { name: /\+ 이력서/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '태그 자동 추천' }));
    fireEvent.click(screen.getByRole('button', { name: /\+ 이력서/ }));
    expect(onToggle).toHaveBeenCalledWith(10);
    expect(screen.queryByRole('button', { name: /\+ 자기소개서/ })).toBeNull();
    expect(screen.getByText("제목에 '이력서'")).toBeTruthy();
  });
});
