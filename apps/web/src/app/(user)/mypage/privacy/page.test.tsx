import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ConfirmProvider } from '@letscareer/ui';

const deleteMock = jest.fn();
jest.mock('../../../../utils/axios', () => ({
  __esModule: true,
  default: {
    delete: (...args: unknown[]) => deleteMock(...args),
  },
}));

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

const logoutMock = jest.fn();
jest.mock('../../../../store/useAuthStore', () => ({
  __esModule: true,
  default: () => ({ logout: logoutMock }),
}));

// 본 테스트는 회원 탈퇴 흐름이 관심사 → 무거운 하위 섹션은 stub.
jest.mock('../../../../domain/mypage/privacy/section/BasicInfo', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../../../../domain/mypage/privacy/section/ChangePassword', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('../../../../domain/mypage/privacy/section/MarketingAgree', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('@/domain/mypage/privacy/section/MyPageKakaoChannel', () => ({
  __esModule: true,
  default: () => null,
}));

import Privacy from './page';

function renderPrivacy() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: 0 }, queries: { retry: 0 } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <ConfirmProvider>
        <Privacy />
      </ConfirmProvider>
    </QueryClientProvider>,
  );
}

describe('회원 탈퇴 confirm', () => {
  beforeEach(() => {
    deleteMock.mockReset();
    deleteMock.mockResolvedValue({ data: {} });
    pushMock.mockReset();
    logoutMock.mockReset();
  });

  it('탈퇴 버튼 클릭 시 destructive ConfirmDialog가 노출된다', async () => {
    const user = userEvent.setup();
    renderPrivacy();

    await user.click(screen.getByRole('button', { name: '회원 탈퇴' }));

    expect(
      await screen.findByText('회원 탈퇴 하시겠어요?'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('탈퇴 시 계정 및 활동 내역이 복구되지 않습니다.'),
    ).toBeInTheDocument();

    // destructive variant 적용 확인
    const dialog = screen.getByRole('alertdialog');
    expect(
      dialog.querySelector('[data-variant="destructive"]'),
    ).not.toBeNull();
  });

  it('Cancel 클릭 시 DELETE /user 가 호출되지 않는다', async () => {
    const user = userEvent.setup();
    renderPrivacy();

    await user.click(screen.getByRole('button', { name: '회원 탈퇴' }));
    await screen.findByText('회원 탈퇴 하시겠어요?');
    await user.click(screen.getByRole('button', { name: '취소' }));

    await waitFor(() => {
      expect(
        screen.queryByText('회원 탈퇴 하시겠어요?'),
      ).not.toBeInTheDocument();
    });
    expect(deleteMock).not.toHaveBeenCalled();
  });

  it('Confirm 클릭 시 DELETE /user 가 호출된다', async () => {
    const user = userEvent.setup();
    renderPrivacy();

    await user.click(screen.getByRole('button', { name: '회원 탈퇴' }));
    await screen.findByText('회원 탈퇴 하시겠어요?');
    await user.click(screen.getByRole('button', { name: '탈퇴' }));

    await waitFor(() => {
      expect(deleteMock).toHaveBeenCalledWith('/user');
    });
  });
});
