import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { SectionTargetRef } from '../programCategoryApi';
import ManualTargetPicker from './ManualTargetPicker';

vi.mock('@/utils/axios', () => ({
  default: {
    get: vi.fn(async () => ({
      data: {
        data: {
          programList: [],
          pageInfo: {
            pageNum: 1,
            pageSize: 20,
            totalElements: 0,
            totalPages: 0,
          },
        },
      },
    })),
  },
}));

let latest: SectionTargetRef[] = [];
const Harness = ({ initial }: { initial: SectionTargetRef[] }) => {
  const [value, setValue] = useState(initial);
  latest = value;
  return <ManualTargetPicker value={value} onChange={setValue} />;
};

const renderPicker = (initial: SectionTargetRef[]) =>
  render(
    <QueryClientProvider client={new QueryClient()}>
      <Harness initial={initial} />
    </QueryClientProvider>,
  );

describe('직접 고르기', () => {
  it('순서를 바꾸고 뺀다', () => {
    renderPicker([
      { targetType: 'BLOG', targetId: 1 },
      { targetType: 'MAGNET', targetId: 2 },
      { targetType: 'LIVE_MENTORING', targetId: 3 },
    ]);
    const rows = () => screen.getAllByRole('listitem');
    fireEvent.click(within(rows()[2]).getByLabelText('위로'));
    expect(latest.map((t) => t.targetId)).toEqual([1, 3, 2]);
    fireEvent.click(within(rows()[0]).getByLabelText('빼기'));
    expect(latest.map((t) => t.targetId)).toEqual([3, 2]);
  });

  it('검색이 없는 유형은 id 를 넣고 "넣기"로 더한다. 같은 상품은 두 번 넣지 않는다', () => {
    renderPicker([{ targetType: 'BLOG', targetId: 7 }]);
    fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
    fireEvent.click(screen.getByRole('option', { name: '블로그' }));
    fireEvent.change(screen.getByLabelText('상품 id'), {
      target: { value: '9' },
    });
    fireEvent.click(screen.getByRole('button', { name: '넣기' }));
    expect(latest).toEqual([
      { targetType: 'BLOG', targetId: 7 },
      { targetType: 'BLOG', targetId: 9 },
    ]);
    fireEvent.change(screen.getByLabelText('상품 id'), {
      target: { value: '7' },
    });
    fireEvent.click(screen.getByRole('button', { name: '넣기' }));
    expect(latest).toHaveLength(2);
  });
});
