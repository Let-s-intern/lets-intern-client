import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const patchMock = jest.fn();
jest.mock('../../../../utils/axios', () => ({
  __esModule: true,
  default: {
    patch: (...args: unknown[]) => patchMock(...args),
  },
}));

// useToast는 ChangePassword 외부에서 발화 사실만 검증하면 충분하므로 spy로 대체.
const toastSuccessMock = jest.fn();
const toastErrorMock = jest.fn();
jest.mock('@letscareer/ui', () => {
  const actual = jest.requireActual('@letscareer/ui');
  return {
    ...actual,
    useToast: () => ({
      success: toastSuccessMock,
      error: toastErrorMock,
      toast: jest.fn(),
    }),
  };
});

import ChangePassword from './ChangePassword';

function renderChangePassword() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: 0 }, queries: { retry: 0 } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ChangePassword />
    </QueryClientProvider>,
  );
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('기존 비밀번호'), 'oldPass123!');
  await user.type(screen.getByLabelText('새로운 비밀번호'), 'newPass456!');
  await user.type(screen.getByLabelText('비밀번호 확인'), 'newPass456!');
}

describe('ChangePassword confirm', () => {
  beforeEach(() => {
    patchMock.mockReset();
    patchMock.mockResolvedValue({ data: {} });
    toastSuccessMock.mockReset();
    toastErrorMock.mockReset();
  });

  it('폼 제출 시 ConfirmDialog가 노출된다', async () => {
    const user = userEvent.setup();
    renderChangePassword();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: '비밀번호 변경' }));

    expect(
      await screen.findByText('비밀번호를 변경하시겠어요?'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('변경 후 새 비밀번호로 다시 로그인해야 할 수 있습니다.'),
    ).toBeInTheDocument();
    expect(patchMock).not.toHaveBeenCalled();
  });

  it('Cancel 클릭 시 mutation이 호출되지 않는다', async () => {
    const user = userEvent.setup();
    renderChangePassword();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: '비밀번호 변경' }));
    await screen.findByText('비밀번호를 변경하시겠어요?');
    await user.click(screen.getByRole('button', { name: '취소' }));

    await waitFor(() => {
      expect(
        screen.queryByText('비밀번호를 변경하시겠어요?'),
      ).not.toBeInTheDocument();
    });
    expect(patchMock).not.toHaveBeenCalled();
  });

  it('Confirm 클릭 시 PATCH /user/password 가 호출된다', async () => {
    const user = userEvent.setup();
    renderChangePassword();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: '비밀번호 변경' }));
    await screen.findByText('비밀번호를 변경하시겠어요?');
    await user.click(screen.getByRole('button', { name: '변경' }));

    await waitFor(() => {
      expect(patchMock).toHaveBeenCalledWith('/user/password', {
        password: 'oldPass123!',
        newPassword: 'newPass456!',
      });
    });
  });

  it('Cancel 후 폼 입력값이 유지된다', async () => {
    const user = userEvent.setup();
    renderChangePassword();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: '비밀번호 변경' }));
    await screen.findByText('비밀번호를 변경하시겠어요?');
    await user.click(screen.getByRole('button', { name: '취소' }));

    await waitFor(() => {
      expect(
        screen.queryByText('비밀번호를 변경하시겠어요?'),
      ).not.toBeInTheDocument();
    });

    expect(screen.getByLabelText('기존 비밀번호')).toHaveValue('oldPass123!');
    expect(screen.getByLabelText('새로운 비밀번호')).toHaveValue('newPass456!');
    expect(screen.getByLabelText('비밀번호 확인')).toHaveValue('newPass456!');
  });
});

describe('ChangePassword toast', () => {
  beforeEach(() => {
    patchMock.mockReset();
    toastSuccessMock.mockReset();
    toastErrorMock.mockReset();
  });

  it('mutation 성공 시 toast.success가 호출된다', async () => {
    const user = userEvent.setup();
    patchMock.mockResolvedValue({ data: {} });
    renderChangePassword();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: '비밀번호 변경' }));
    await screen.findByText('비밀번호를 변경하시겠어요?');
    await user.click(screen.getByRole('button', { name: '변경' }));

    await waitFor(() => {
      expect(toastSuccessMock).toHaveBeenCalledWith(
        '비밀번호가 변경되었습니다',
      );
    });
    expect(toastErrorMock).not.toHaveBeenCalled();
  });

  it('mutation 실패(400) 시 "기존 비밀번호가 올바르지 않습니다" error toast가 호출된다', async () => {
    const user = userEvent.setup();
    patchMock.mockRejectedValue({
      response: { data: { status: 400 } },
      isAxiosError: true,
    });
    renderChangePassword();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: '비밀번호 변경' }));
    await screen.findByText('비밀번호를 변경하시겠어요?');
    await user.click(screen.getByRole('button', { name: '변경' }));

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith(
        '기존 비밀번호가 올바르지 않습니다',
      );
    });
  });

  it('mutation 실패(기타) 시 "비밀번호 변경에 실패했습니다" error toast가 호출된다', async () => {
    const user = userEvent.setup();
    patchMock.mockRejectedValue({
      response: { data: { status: 500 } },
      isAxiosError: true,
    });
    renderChangePassword();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: '비밀번호 변경' }));
    await screen.findByText('비밀번호를 변경하시겠어요?');
    await user.click(screen.getByRole('button', { name: '변경' }));

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith(
        '비밀번호 변경에 실패했습니다',
      );
    });
  });

  it('새 비밀번호와 확인이 불일치하면 검증 error toast가 호출된다 (confirm 미노출)', async () => {
    const user = userEvent.setup();
    renderChangePassword();

    await user.type(screen.getByLabelText('기존 비밀번호'), 'oldPass123!');
    await user.type(screen.getByLabelText('새로운 비밀번호'), 'newPass456!');
    await user.type(screen.getByLabelText('비밀번호 확인'), 'mismatch!');
    await user.click(screen.getByRole('button', { name: '비밀번호 변경' }));

    expect(toastErrorMock).toHaveBeenCalledWith('비밀번호가 일치하지 않습니다');
    expect(
      screen.queryByText('비밀번호를 변경하시겠어요?'),
    ).not.toBeInTheDocument();
    expect(patchMock).not.toHaveBeenCalled();
  });

  it('기존 비밀번호와 새 비밀번호가 같으면 검증 error toast가 호출된다 (confirm 미노출)', async () => {
    const user = userEvent.setup();
    renderChangePassword();

    await user.type(screen.getByLabelText('기존 비밀번호'), 'samePass1!');
    await user.type(screen.getByLabelText('새로운 비밀번호'), 'samePass1!');
    await user.type(screen.getByLabelText('비밀번호 확인'), 'samePass1!');
    await user.click(screen.getByRole('button', { name: '비밀번호 변경' }));

    expect(toastErrorMock).toHaveBeenCalledWith(
      '기존 비밀번호와 새로운 비밀번호가 같습니다',
    );
    expect(
      screen.queryByText('비밀번호를 변경하시겠어요?'),
    ).not.toBeInTheDocument();
    expect(patchMock).not.toHaveBeenCalled();
  });
});
