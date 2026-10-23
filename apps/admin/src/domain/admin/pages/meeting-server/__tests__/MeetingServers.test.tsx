import type { MeetingServer } from '@/api/meetingServerSchema';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import MeetingServers from '../MeetingServers';

/**
 * 이 목록이 답해야 하는 질문.
 *
 *   1. 어느 서버가 주 서버이고 어느 서버가 폴백인가
 *   2. 그중 지금 회의실로 쓸 수 있는 것은 무엇인가
 *
 * 2번이 뒤집혀 보이면 살아 있는 서버를 끄게 된다. 그래서 사용 상태 표시와 토글이 보내는
 * 값을 함께 본다.
 */

const listQuery = vi.fn();
const updateMutate = vi.fn();
const deleteMutate = vi.fn();
let updateErrorCallback: ((error: Error) => void) | undefined;

vi.mock('@/api/meetingServer', () => ({
  useMeetingServerListQuery: () => listQuery(),
  useUpdateMeetingServer: (callbacks: {
    errorCallback?: (error: Error) => void;
  }) => {
    updateErrorCallback = callbacks.errorCallback;
    return { mutate: updateMutate, isPending: false };
  },
  useDeleteMeetingServer: () => ({ mutate: deleteMutate, isPending: false }),
}));

const rows: MeetingServer[] = [
  {
    meetingServerId: 1,
    baseUrl: 'https://jitsi-meet.letscareer.co.kr/',
    priority: 0,
    isActive: true,
    lastModifiedDate: '2026-10-06T10:00:00',
  },
  {
    meetingServerId: 2,
    baseUrl: 'https://jitsi-ayjsueey4v9euvyy9gsgmmtz.supabin.com/',
    priority: 1,
    isActive: false,
    lastModifiedDate: null,
  },
];

const renderList = () =>
  render(
    <MemoryRouter>
      <MeetingServers />
    </MemoryRouter>,
  );

const rowOf = (baseUrl: string) => screen.getByText(baseUrl).closest('tr')!;

beforeEach(() => {
  listQuery.mockReset();
  updateMutate.mockReset();
  deleteMutate.mockReset();
  listQuery.mockReturnValue({ data: rows, isLoading: false, isError: false });
});

describe('MeetingServers', () => {
  it('서버가 준 순서대로 우선순위와 주소를 그린다', () => {
    renderList();

    const [first, second] = screen.getAllByRole('row').slice(1);
    expect(within(first).getByText('0')).toBeInTheDocument();
    expect(first).toBe(rowOf('https://jitsi-meet.letscareer.co.kr/'));
    expect(second).toBe(
      rowOf('https://jitsi-ayjsueey4v9euvyy9gsgmmtz.supabin.com/'),
    );
  });

  it('사용 상태를 글자로 적고, 토글은 반대 값을 보낸다', async () => {
    renderList();

    const main = within(rowOf('https://jitsi-meet.letscareer.co.kr/'));
    const toggle = main.getByRole('switch');
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    expect(toggle).toHaveTextContent('사용 중');

    await userEvent.click(toggle);
    expect(updateMutate).toHaveBeenCalledWith({
      meetingServerId: 1,
      isActive: false,
    });
  });

  it('서버가 거절한 사유를 화면에 남긴다', async () => {
    renderList();

    const { act } = await import('@testing-library/react');
    const { AxiosError } = await import('axios');
    const error = new AxiosError('Request failed with status code 400');
    error.response = {
      data: { message: '사용 중인 회의 서버가 하나는 있어야 합니다.' },
    } as never;
    act(() => updateErrorCallback?.(error));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '사용 중인 회의 서버가 하나는 있어야 합니다.',
    );
  });

  it('삭제는 확인을 거쳐 해당 id 로 보낸다', async () => {
    renderList();

    await userEvent.click(
      screen.getByRole('button', {
        name: 'https://jitsi-meet.letscareer.co.kr/ 삭제',
      }),
    );
    expect(deleteMutate).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', { name: '삭제' }));
    expect(deleteMutate).toHaveBeenCalledWith(1);
  });

  it('조회 실패를 빈 목록과 구분한다', () => {
    listQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
    });
    renderList();

    expect(
      screen.getByText(/회의 서버 목록을 불러오지 못했습니다/),
    ).toBeInTheDocument();
    expect(screen.queryByText('등록된 회의 서버가 없습니다.')).toBeNull();
  });
});
