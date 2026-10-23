import { act, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import {
  createMemoryRouter,
  RouterProvider,
  useNavigate,
} from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { LEAVE_MESSAGE, useLeaveGuard } from '../hooks/useLeaveGuard';

function Editor({ enabled = true }: { enabled?: boolean }) {
  const [value, setValue] = useState('');
  const navigate = useNavigate();
  const { trackInteraction, markSaved } = useLeaveGuard(() => value, enabled);
  return (
    <div
      onPointerDownCapture={trackInteraction}
      onKeyDownCapture={trackInteraction}
    >
      <input
        aria-label="값"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="button" onClick={markSaved}>
        저장
      </button>
      <button type="button" onClick={() => navigate('/other')}>
        나가기
      </button>
    </div>
  );
}

const renderEditor = (enabled = true) => {
  const router = createMemoryRouter(
    [
      { path: '/edit', element: <Editor enabled={enabled} /> },
      { path: '/other', element: <div>다른 화면</div> },
    ],
    { initialEntries: ['/edit'] },
  );
  render(<RouterProvider router={router} />);
  return router;
};

const type = (text: string) => {
  const input = screen.getByLabelText('값');
  fireEvent.keyDown(input);
  fireEvent.change(input, { target: { value: text } });
};

describe('useLeaveGuard', () => {
  afterEach(() => vi.restoreAllMocks());

  it('손대지 않았으면 묻지 않고 이동한다', async () => {
    const confirm = vi.spyOn(window, 'confirm');
    const router = renderEditor();

    fireEvent.click(screen.getByRole('button', { name: '나가기' }));

    expect(await screen.findByText('다른 화면')).toBeInTheDocument();
    expect(confirm).not.toHaveBeenCalled();
    expect(router.state.location.pathname).toBe('/other');
  });

  it('바꾸고 나가려 하면 확인을 받고, 취소하면 머문다', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const router = renderEditor();
    type('수정');

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '나가기' }));
    });

    expect(confirm).toHaveBeenCalledWith(LEAVE_MESSAGE);
    expect(router.state.location.pathname).toBe('/edit');
  });

  it('확인하면 이동한다', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    renderEditor();
    type('수정');

    fireEvent.click(screen.getByRole('button', { name: '나가기' }));

    expect(await screen.findByText('다른 화면')).toBeInTheDocument();
  });

  it('바꿨다가 원래대로 되돌리면 묻지 않는다', async () => {
    const confirm = vi.spyOn(window, 'confirm');
    renderEditor();
    type('수정');
    type('');

    fireEvent.click(screen.getByRole('button', { name: '나가기' }));

    expect(await screen.findByText('다른 화면')).toBeInTheDocument();
    expect(confirm).not.toHaveBeenCalled();
  });

  it('저장한 뒤에는 묻지 않는다', async () => {
    const confirm = vi.spyOn(window, 'confirm');
    renderEditor();
    type('수정');
    fireEvent.click(screen.getByRole('button', { name: '저장' }));

    fireEvent.click(screen.getByRole('button', { name: '나가기' }));

    expect(await screen.findByText('다른 화면')).toBeInTheDocument();
    expect(confirm).not.toHaveBeenCalled();
  });

  it('바꾼 상태에서 새로고침·탭 닫기를 하면 브라우저 경고를 띄운다', () => {
    renderEditor();
    type('수정');

    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it('꺼 두면 바꿔도 묻지 않는다 - 생성 완료처럼 더 저장할 수 없는 화면', async () => {
    const confirm = vi.spyOn(window, 'confirm');
    renderEditor(false);
    type('수정');

    fireEvent.click(screen.getByRole('button', { name: '나가기' }));

    expect(await screen.findByText('다른 화면')).toBeInTheDocument();
    expect(confirm).not.toHaveBeenCalled();
  });
});
