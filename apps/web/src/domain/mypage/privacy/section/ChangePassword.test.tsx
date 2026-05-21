import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ConfirmProvider } from '@letscareer/ui';
import ChangePassword from './ChangePassword';

const patchMock = jest.fn();
jest.mock('../../../../utils/axios', () => ({
  __esModule: true,
  default: {
    patch: (...args: unknown[]) => patchMock(...args),
  },
}));

// alert는 jsdom 미구현이라 stub.
const alertSpy = jest.fn();

function renderChangePassword() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: 0 }, queries: { retry: 0 } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ConfirmProvider>
        <ChangePassword />
      </ConfirmProvider>
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
    alertSpy.mockReset();
    window.alert = alertSpy;
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
