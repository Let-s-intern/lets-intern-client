import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { stackRowRects } from '../../ui/__tests__/stackRowRects';
import NoticeSection from '../NoticeSection';

const { getMock, putMock } = vi.hoisted(() => ({
  getMock: vi.fn(),
  putMock: vi.fn(),
}));

vi.mock('@/utils/axios', () => ({
  default: { get: getMock, put: putMock },
}));
vi.mock('@/hooks/useAdminSnackbar', () => ({
  useAdminSnackbar: () => ({ snackbar: vi.fn() }),
}));
vi.mock('@/context/CurrentAdminChallengeProvider', () => ({
  useAdminCurrentChallenge: () => ({ currentChallenge: { id: 7 } }),
}));

const noticeList = [
  {
    id: 21,
    type: 'ESSENTIAL',
    title: '공지 A',
    link: '/a',
    createDate: '2026-11-01T00:00:00',
  },
  {
    id: 22,
    type: 'ESSENTIAL',
    title: '공지 B',
    link: '/b',
    createDate: '2026-11-02T00:00:00',
  },
];

let restoreRects: () => void;

beforeEach(() => {
  restoreRects = stackRowRects();
  getMock.mockReset();
  putMock.mockReset();
  getMock.mockResolvedValue({
    data: {
      data: {
        challengeNoticeList: noticeList,
        pageInfo: {
          pageNum: 1,
          pageSize: 1000,
          totalPages: 1,
          totalElements: 2,
        },
      },
    },
  });
});

afterEach(() => {
  restoreRects();
});

describe('NoticeSection 순서 변경', () => {
  it('전체를 한 번에 가져오고 페이지 번호를 보여주지 않는다', async () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <NoticeSection />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByText('공지 A');

    expect(getMock).toHaveBeenCalledWith('/challenge/7/notices', {
      params: { page: 1, size: 1000 },
    });
    expect(screen.queryByText('1', { selector: 'span' })).toBeNull();
  });

  it('키보드로 첫 항목을 내리면 challengeNoticeIdList 로 PUT 한다', async () => {
    putMock.mockResolvedValue({});
    const user = userEvent.setup();
    render(
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <NoticeSection />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    const [firstHandle] = await screen.findAllByRole('button', {
      name: '순서 변경',
    });
    firstHandle.focus();
    await user.keyboard(' ');
    await user.keyboard('{ArrowDown}');
    await user.keyboard(' ');

    await waitFor(() =>
      expect(putMock).toHaveBeenCalledWith('/admin/challenge/7/notice/order', {
        challengeNoticeIdList: [22, 21],
      }),
    );
  });
});
