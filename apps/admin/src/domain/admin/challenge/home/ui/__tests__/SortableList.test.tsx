import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SortableList from '../SortableList';
import { stackRowRects } from './stackRowRects';

const items = [
  { id: 1, title: '첫째' },
  { id: 2, title: '둘째' },
  { id: 3, title: '셋째' },
];

let restoreRects: () => void;

beforeEach(() => {
  restoreRects = stackRowRects();
});

afterEach(() => {
  restoreRects();
});

const renderList = (props: { disabled?: boolean; onReorder: () => void }) =>
  render(
    <SortableList
      items={items}
      renderItem={(item) => <span>{item.title}</span>}
      {...props}
    />,
  );

describe('SortableList', () => {
  it('각 행에 순서 변경 핸들이 있다', () => {
    renderList({ onReorder: vi.fn() });

    expect(screen.getAllByRole('button', { name: '순서 변경' })).toHaveLength(
      3,
    );
  });

  it('키보드로 항목을 한 칸 내리면 새 순서로 onReorder 가 호출된다', async () => {
    const onReorder = vi.fn();
    const user = userEvent.setup();
    renderList({ onReorder });

    const [firstHandle] = screen.getAllByRole('button', { name: '순서 변경' });
    firstHandle.focus();
    await user.keyboard(' ');
    await user.keyboard('{ArrowDown}');
    await user.keyboard(' ');

    await waitFor(() => expect(onReorder).toHaveBeenCalledTimes(1));
    expect(onReorder.mock.calls[0][0].map((i: { id: number }) => i.id)).toEqual(
      [2, 1, 3],
    );
  });

  it('disabled 이면 핸들이 비활성이고 키보드로 옮겨도 onReorder 가 호출되지 않는다', async () => {
    const onReorder = vi.fn();
    const user = userEvent.setup();
    renderList({ onReorder, disabled: true });

    const handles = screen.getAllByRole('button', { name: '순서 변경' });
    handles.forEach((handle) => expect(handle).toBeDisabled());

    handles[0].focus();
    await user.keyboard(' ');
    await user.keyboard('{ArrowDown}');
    await user.keyboard(' ');

    expect(onReorder).not.toHaveBeenCalled();
  });
});
