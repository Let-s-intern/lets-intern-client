import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { stackRowRects } from '../../ui/__tests__/stackRowRects';
import GuideSection from '../GuideSection';

const { getMock, putMock, snackbarMock } = vi.hoisted(() => ({
  getMock: vi.fn(),
  putMock: vi.fn(),
  snackbarMock: vi.fn(),
}));

vi.mock('@/utils/axios', () => ({
  default: { get: getMock, put: putMock },
}));
vi.mock('@/hooks/useAdminSnackbar', () => ({
  useAdminSnackbar: () => ({ snackbar: snackbarMock }),
}));
vi.mock('@/context/CurrentAdminChallengeProvider', () => ({
  useAdminCurrentChallenge: () => ({ currentChallenge: { id: 7 } }),
}));

const guideList = [
  { id: 11, title: '가이드 A', link: '/a', createDate: '2026-11-01T00:00:00' },
  { id: 12, title: '가이드 B', link: '/b', createDate: '2026-11-02T00:00:00' },
  { id: 13, title: '가이드 C', link: '/c', createDate: '2026-11-03T00:00:00' },
];

const renderSection = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <GuideSection />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

const titles = () =>
  screen
    .getAllByRole('listitem')
    .map((li) => li.querySelector('a')?.textContent);

const moveFirstDown = async (user: ReturnType<typeof userEvent.setup>) => {
  const [firstHandle] = await screen.findAllByRole('button', {
    name: '순서 변경',
  });
  firstHandle.focus();
  await user.keyboard(' ');
  await user.keyboard('{ArrowDown}');
  await user.keyboard(' ');
};

let restoreRects: () => void;

beforeEach(() => {
  restoreRects = stackRowRects();
  getMock.mockReset();
  putMock.mockReset();
  snackbarMock.mockReset();
  getMock.mockResolvedValue({
    data: { data: { challengeGuideList: guideList } },
  });
});

afterEach(() => {
  restoreRects();
});

describe('GuideSection 순서 변경', () => {
  it('키보드로 첫 항목을 내리면 저장 응답 전에 화면 순서가 바뀌고 id 배열로 PUT 한다', async () => {
    // 응답을 보류해 낙관적 갱신 상태를 본다 (성공 후에는 서버 목록을 다시 불러온다)
    putMock.mockReturnValue(new Promise(() => {}));
    const user = userEvent.setup();
    renderSection();

    await moveFirstDown(user);

    await waitFor(() =>
      expect(putMock).toHaveBeenCalledWith('/admin/challenge/7/guide/order', {
        challengeGuideIdList: [12, 11, 13],
      }),
    );
    expect(titles()).toEqual(['가이드 B', '가이드 A', '가이드 C']);
  });

  it('저장 중에는 핸들이 비활성이라 한 번 더 옮길 수 없다', async () => {
    putMock.mockReturnValue(new Promise(() => {}));
    const user = userEvent.setup();
    renderSection();

    await moveFirstDown(user);

    await waitFor(() =>
      screen
        .getAllByRole('button', { name: '순서 변경' })
        .forEach((handle) => expect(handle).toBeDisabled()),
    );
    expect(putMock).toHaveBeenCalledTimes(1);
  });

  it('PUT 이 실패하면 원래 순서로 되돌리고 알림을 띄운다', async () => {
    putMock.mockRejectedValue(new Error('400'));
    const user = userEvent.setup();
    renderSection();

    await moveFirstDown(user);

    await waitFor(() => expect(snackbarMock).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(titles()).toEqual(['가이드 A', '가이드 B', '가이드 C']),
    );
  });
});
