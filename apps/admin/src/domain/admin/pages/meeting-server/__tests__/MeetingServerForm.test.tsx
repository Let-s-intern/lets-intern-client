import type { MeetingServer } from '@/api/meetingServerSchema';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import MeetingServerForm from '../MeetingServerForm';

/**
 * 폼이 서버에 보내는 바디가 `CreateMeetingServerRequestDto`·`UpdateMeetingServerRequestDto`
 * 와 같은 모양인지, 서버가 거절할 값을 먼저 막는지를 본다.
 */

const listQuery = vi.fn();
const createMutate = vi.fn();
const updateMutate = vi.fn();

vi.mock('@/api/meetingServer', () => ({
  useMeetingServerListQuery: () => listQuery(),
  useCreateMeetingServer: () => ({ mutate: createMutate, isPending: false }),
  useUpdateMeetingServer: () => ({ mutate: updateMutate, isPending: false }),
}));

const server: MeetingServer = {
  meetingServerId: 7,
  baseUrl: 'https://jitsi-meet.letscareer.co.kr/',
  priority: 0,
  isActive: true,
};

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/meeting-servers/new" element={<MeetingServerForm />} />
        <Route
          path="/meeting-servers/:id/edit"
          element={<MeetingServerForm />}
        />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => {
  createMutate.mockReset();
  updateMutate.mockReset();
  listQuery.mockReturnValue({
    data: [server],
    isLoading: false,
    isError: false,
  });
});

describe('MeetingServerForm', () => {
  it('등록은 baseUrl·priority·isActive 를 보낸다', async () => {
    renderAt('/meeting-servers/new');

    await userEvent.type(
      screen.getByLabelText('주소'),
      ' https://jitsi-backup.example.com/ ',
    );
    await userEvent.type(screen.getByLabelText('우선순위'), '1');
    await userEvent.click(screen.getByRole('button', { name: '등록' }));

    expect(createMutate).toHaveBeenCalledWith({
      baseUrl: 'https://jitsi-backup.example.com/',
      priority: 1,
      isActive: true,
    });
  });

  it('서버가 거절할 주소는 보내지 않고 사유를 보여준다', async () => {
    renderAt('/meeting-servers/new');

    await userEvent.type(
      screen.getByLabelText('주소'),
      'https://jitsi-backup.example.com',
    );
    await userEvent.type(screen.getByLabelText('우선순위'), '1');
    await userEvent.click(screen.getByRole('button', { name: '등록' }));

    expect(createMutate).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(
      '주소는 / 로 끝나야 합니다.',
    );
  });

  it('우선순위가 비면 보내지 않는다', async () => {
    renderAt('/meeting-servers/new');

    await userEvent.type(
      screen.getByLabelText('주소'),
      'https://jitsi-backup.example.com/',
    );
    await userEvent.click(screen.getByRole('button', { name: '등록' }));

    expect(createMutate).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(
      '우선순위는 0 이상의 정수로 입력해 주세요.',
    );
  });

  it('수정은 목록에서 찾은 값으로 채우고 해당 id 로 보낸다', async () => {
    renderAt('/meeting-servers/7/edit');

    expect(screen.getByLabelText('주소')).toHaveValue(server.baseUrl);

    await userEvent.click(screen.getByLabelText('사용'));
    await userEvent.click(screen.getByRole('button', { name: '저장' }));

    expect(updateMutate).toHaveBeenCalledWith({
      meetingServerId: 7,
      baseUrl: server.baseUrl,
      priority: 0,
      isActive: false,
    });
  });

  it('목록에 없는 id 는 찾을 수 없다고 알린다', () => {
    renderAt('/meeting-servers/99/edit');

    expect(
      screen.getByText('회의 서버를 찾을 수 없습니다.'),
    ).toBeInTheDocument();
  });
});
