import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const get = vi.fn();
const put = vi.fn();
const getV2 = vi.fn();

vi.mock('@/utils/axios', () => ({
  default: {
    get: (...args: unknown[]) => get(...args),
    put: (...args: unknown[]) => put(...args),
  },
}));

vi.mock('@/utils/axiosV2', () => ({
  default: { get: (...args: unknown[]) => getV2(...args) },
}));

import { AdminSnackbarProvider } from '@/hooks/useAdminSnackbar';

import MentorPickStatus from '../MentorPickStatus';

const pick = (mentorId: number, name: string, isVisible = true) => ({
  mentorId,
  name,
  nickname: `${name}닉`,
  isVisible,
  sortOrder: mentorId,
});

const PICKS = [pick(1, 'A'), pick(2, 'B', false), pick(3, 'C')];

const renderStatus = (mentorId: number) =>
  render(
    <QueryClientProvider
      client={
        new QueryClient({
          defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
          },
        })
      }
    >
      <AdminSnackbarProvider>
        <MentorPickStatus mentorId={mentorId} />
      </AdminSnackbarProvider>
    </QueryClientProvider>,
  );

const dialog = () => screen.getByRole('dialog');
const savedMentorIds = () => put.mock.calls[0][1].mentorIds;

describe('MentorPickStatus', () => {
  beforeEach(() => {
    get.mockResolvedValue({ data: { data: { pickList: PICKS } } });
    put.mockResolvedValue({});
    getV2.mockResolvedValue({
      data: {
        data: {
          mentorList: [{ id: 9, name: 'Z', nickname: '지', isVisible: true }],
        },
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('픽이면 순위와 「순위 수정」 을 보인다', async () => {
    renderStatus(3);
    expect(await screen.findByText('렛커 픽 3위')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '순위 수정' }),
    ).toBeInTheDocument();
  });

  it('픽이 아니면 미등록과 「렛커 픽 관리」 를 보인다', async () => {
    renderStatus(9);
    expect(await screen.findByText('렛커 픽 미등록')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '렛커 픽 관리' }),
    ).toBeInTheDocument();
  });

  it('창에서 이 멘토 행을 강조하고, 바꾸기 전에는 저장이 꺼져 있다', async () => {
    renderStatus(3);
    fireEvent.click(await screen.findByRole('button', { name: '순위 수정' }));

    const current = within(dialog())
      .getAllByRole('row')
      .find((row) => row.getAttribute('aria-current') === 'true');
    expect(current).toHaveTextContent('C');
    expect(current).toHaveTextContent('이 멘토');
    expect(within(dialog()).getByText('비노출')).toBeInTheDocument();
    expect(
      within(dialog()).getByRole('button', { name: '순서 저장' }),
    ).toBeDisabled();
  });

  it('순위를 바꾸고 빼고 저장하면 그 순서로 PUT 하고 창을 닫는다', async () => {
    renderStatus(3);
    fireEvent.click(await screen.findByRole('button', { name: '순위 수정' }));
    const inputs = within(dialog()).getAllByLabelText('노출 순위');
    fireEvent.change(inputs[2], { target: { value: '1' } });
    fireEvent.keyDown(inputs[2], { key: 'Enter' });
    // C A B 에서 B 를 뺀다
    fireEvent.click(
      within(dialog()).getAllByRole('button', { name: '빼기' })[2],
    );
    fireEvent.click(
      within(dialog()).getByRole('button', { name: '순서 저장' }),
    );

    await waitFor(() => expect(put).toHaveBeenCalled());
    expect(put.mock.calls[0][0]).toBe('/admin/mentor/pick');
    expect(savedMentorIds()).toEqual([3, 1]);
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
  });

  it('미등록이면 이 멘토를 맨 뒤에 추가해 저장할 수 있다', async () => {
    renderStatus(9);
    fireEvent.click(
      await screen.findByRole('button', { name: '렛커 픽 관리' }),
    );
    fireEvent.click(
      within(dialog()).getByRole('button', {
        name: '이 멘토를 렛커 픽에 추가',
      }),
    );
    await waitFor(() =>
      expect(within(dialog()).getByText('이 멘토')).toBeInTheDocument(),
    );
    expect(
      within(dialog()).queryByRole('button', {
        name: '이 멘토를 렛커 픽에 추가',
      }),
    ).not.toBeInTheDocument();
    fireEvent.click(
      within(dialog()).getByRole('button', { name: '순서 저장' }),
    );

    await waitFor(() => expect(put).toHaveBeenCalled());
    expect(savedMentorIds()).toEqual([1, 2, 3, 9]);
  });

  it('저장이 실패하면 창을 그대로 두고 알린다', async () => {
    put.mockRejectedValue(new Error('500'));
    renderStatus(3);
    fireEvent.click(await screen.findByRole('button', { name: '순위 수정' }));
    fireEvent.click(within(dialog()).getAllByLabelText('위로 이동')[2]);
    fireEvent.click(
      within(dialog()).getByRole('button', { name: '순서 저장' }),
    );

    expect(
      await screen.findByText('렛커 픽 저장에 실패했습니다.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('바꾼 채로 취소하면 확인하고, 취소를 고르면 창을 둔다', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderStatus(3);
    fireEvent.click(await screen.findByRole('button', { name: '순위 수정' }));
    fireEvent.click(within(dialog()).getAllByLabelText('위로 이동')[2]);
    fireEvent.click(within(dialog()).getByRole('button', { name: '취소' }));

    expect(confirm).toHaveBeenCalledWith(
      '저장하지 않은 변경 사항이 있습니다. 닫을까요?',
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    confirm.mockReturnValue(true);
    fireEvent.click(within(dialog()).getByRole('button', { name: '취소' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument(),
    );
    expect(put).not.toHaveBeenCalled();
  });
});
