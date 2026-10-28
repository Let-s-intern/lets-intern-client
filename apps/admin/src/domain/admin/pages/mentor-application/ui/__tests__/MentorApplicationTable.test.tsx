import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const get = vi.fn();
const patch = vi.fn();
const del = vi.fn();
const snackbar = vi.fn();

vi.mock('@/utils/axios', () => ({
  default: {
    get: (...args: unknown[]) => get(...args),
    patch: (...args: unknown[]) => patch(...args),
    delete: (...args: unknown[]) => del(...args),
  },
}));
vi.mock('@/hooks/useAdminSnackbar', () => ({
  useAdminSnackbar: () => ({ snackbar }),
}));

import MentorApplicationTable from '../MentorApplicationTable';

const application = {
  id: 7,
  submittedAt: '2026-10-28T14:02:00',
  name: '김하늘',
  company: '예시테크',
  jobTitle: '프로덕트 매니저',
  phoneNum: '01012345678',
  email: 'haneul.kim@example.com',
  preferredContactMethods: ['PHONE', 'EMAIL'],
  status: 'CHECKING',
  hasAttachment: true,
};

const renderTable = () => {
  get.mockResolvedValue({ data: { data: { applicationList: [application] } } });
  return render(
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
      <MentorApplicationTable />
    </QueryClientProvider>,
  );
};

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe('MentorApplicationTable', () => {
  it('행에 신청 정보를 보여주고 전화번호에 하이픈을 넣는다', async () => {
    renderTable();
    expect(await screen.findByText('김하늘')).toBeInTheDocument();
    expect(screen.getByText('2026.10.28 14:02')).toBeInTheDocument();
    expect(screen.getByText('010-1234-5678')).toBeInTheDocument();
    expect(screen.getByText('전화번호, 이메일')).toBeInTheDocument();
    expect(screen.getByText('확인 중')).toBeInTheDocument();
  });

  it('상태를 고르면 상태 변경 API 를 부르고 스낵바를 띄운다', async () => {
    patch.mockResolvedValue({});
    renderTable();
    fireEvent.mouseDown(
      await screen.findByRole('combobox', { name: '김하늘 신청 현황' }),
    );
    fireEvent.click(
      within(screen.getByRole('listbox')).getByRole('option', {
        name: '회신 완료',
      }),
    );

    await waitFor(() =>
      expect(patch).toHaveBeenCalledWith('/admin/mentor-application/7/status', {
        status: 'REPLIED',
      }),
    );
    await waitFor(() =>
      expect(snackbar).toHaveBeenCalledWith('신청 현황이 변경되었습니다.'),
    );
  });

  it('삭제 확인을 취소하면 삭제하지 않는다', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    renderTable();
    fireEvent.click(await screen.findByRole('button', { name: '삭제' }));

    expect(window.confirm).toHaveBeenCalledWith(
      '김하늘님의 신청서를 삭제하시겠습니까?',
    );
    expect(del).not.toHaveBeenCalled();
  });

  it('삭제를 확인하면 삭제하고 목록을 다시 불러오고 스낵바를 띄운다', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    del.mockResolvedValue({});
    renderTable();
    fireEvent.click(await screen.findByRole('button', { name: '삭제' }));

    await waitFor(() =>
      expect(del).toHaveBeenCalledWith('/admin/mentor-application/7'),
    );
    await waitFor(() =>
      expect(snackbar).toHaveBeenCalledWith('신청서가 삭제되었습니다.'),
    );
    expect(get).toHaveBeenCalledTimes(2);
  });
});
