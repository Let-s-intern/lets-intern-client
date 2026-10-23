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

import MentorPickManager from '../../MentorPickManager';

const pick = (mentorId: number, name: string, isVisible = true) => ({
  mentorId,
  name,
  nickname: `${name}닉`,
  isVisible,
  sortOrder: mentorId,
});

const PICKS = [
  pick(1, 'A'),
  pick(2, 'B'),
  pick(3, 'C'),
  pick(4, 'D', false),
  pick(5, 'E'),
];

const renderManager = () =>
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
      <MentorPickManager />
    </QueryClientProvider>,
  );

const rankInputs = () => screen.getAllByLabelText('노출 순위');
const savedMentorIds = () => put.mock.calls[0][1].mentorIds;

describe('MentorPickManager', () => {
  beforeEach(() => {
    get.mockResolvedValue({ data: { data: { pickList: PICKS } } });
    put.mockResolvedValue({});
    getV2.mockResolvedValue({
      data: {
        data: {
          mentorList: [
            { id: 1, name: 'A', nickname: 'A닉', isVisible: true },
            { id: 6, name: 'F', nickname: '에프', isVisible: true },
            { id: 7, name: 'G', nickname: null, isVisible: false },
          ],
        },
      },
    });
  });

  afterEach(() => vi.clearAllMocks());

  it('바꾸기 전에는 순서 저장이 꺼져 있고, 비노출 멘토를 표시한다', async () => {
    renderManager();
    await screen.findByText('A');
    expect(screen.getByRole('button', { name: '순서 저장' })).toBeDisabled();
    expect(screen.getByText('비노출')).toBeInTheDocument();
  });

  it('3위에 1 을 넣고 저장하면 C A B D E 순서로 PUT 한다', async () => {
    renderManager();
    await screen.findByText('A');
    fireEvent.change(rankInputs()[2], { target: { value: '1' } });
    fireEvent.keyDown(rankInputs()[2], { key: 'Enter' });
    fireEvent.click(screen.getByRole('button', { name: '순서 저장' }));

    await waitFor(() => expect(put).toHaveBeenCalled());
    expect(put.mock.calls[0][0]).toBe('/admin/mentor/pick');
    expect(savedMentorIds()).toEqual([3, 1, 2, 4, 5]);
  });

  it('3위 아래 버튼은 3위·4위를 바꾼다', async () => {
    renderManager();
    await screen.findByText('A');
    fireEvent.click(screen.getAllByLabelText('아래로 이동')[2]);
    fireEvent.click(screen.getByRole('button', { name: '순서 저장' }));

    await waitFor(() => expect(put).toHaveBeenCalled());
    expect(savedMentorIds()).toEqual([1, 2, 4, 3, 5]);
  });

  it('첫 행 위 버튼과 마지막 행 아래 버튼은 꺼져 있다', async () => {
    renderManager();
    await screen.findByText('A');
    expect(screen.getAllByLabelText('위로 이동')[0]).toBeDisabled();
    expect(screen.getAllByLabelText('아래로 이동')[4]).toBeDisabled();
  });

  it('빼고 저장하면 남은 멘토만 보낸다', async () => {
    renderManager();
    await screen.findByText('A');
    fireEvent.click(screen.getAllByRole('button', { name: '빼기' })[1]);
    fireEvent.click(screen.getByRole('button', { name: '순서 저장' }));

    await waitFor(() => expect(put).toHaveBeenCalled());
    expect(savedMentorIds()).toEqual([1, 3, 4, 5]);
  });

  it('추가 다이얼로그는 이미 픽인 멘토를 빼고, 고른 멘토를 맨 뒤에 붙인다', async () => {
    renderManager();
    await screen.findByText('A');
    fireEvent.click(screen.getByRole('button', { name: '멘토 추가' }));

    const dialog = await screen.findByRole('dialog');
    await within(dialog).findByText('F (에프)');
    expect(within(dialog).queryByText('A (A닉)')).not.toBeInTheDocument();

    fireEvent.change(within(dialog).getByLabelText('이름·닉네임 검색'), {
      target: { value: '에프' },
    });
    expect(within(dialog).queryByText('G')).not.toBeInTheDocument();
    fireEvent.click(within(dialog).getByLabelText('F (에프)'));
    fireEvent.click(within(dialog).getByRole('button', { name: '추가' }));

    fireEvent.click(screen.getByRole('button', { name: '순서 저장' }));
    await waitFor(() => expect(put).toHaveBeenCalled());
    expect(savedMentorIds()).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
