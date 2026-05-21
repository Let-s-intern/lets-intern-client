import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SideNavContainer from './SideNavContainer';

// 로그인 상태 + 사용자 정보 stub.
jest.mock('@/store/useAuthStore', () => ({
  __esModule: true,
  default: () => ({ isLoggedIn: true, logout: jest.fn() }),
}));

jest.mock('@/api/user/user', () => ({
  useUserQuery: () => ({ data: { name: '홍길동' } }),
}));

const logoutAndRefreshPageMock = jest.fn();
jest.mock('@/utils/auth', () => ({
  logoutAndRefreshPage: () => logoutAndRefreshPageMock(),
}));

// KakaoChannel은 외부 SDK 의존이라 stub.
jest.mock('./KakaoChannel', () => ({
  __esModule: true,
  default: () => null,
}));

function renderSideNav() {
  return render(<SideNavContainer isOpen onClose={jest.fn()} />);
}

describe('SideNavContainer 로그아웃 confirm', () => {
  beforeEach(() => {
    logoutAndRefreshPageMock.mockClear();
  });

  it('로그아웃 버튼 클릭 시 ConfirmDialog가 노출된다', async () => {
    const user = userEvent.setup();
    renderSideNav();

    await user.click(screen.getByRole('button', { name: '로그아웃' }));

    expect(await screen.findByText('로그아웃 하시겠어요?')).toBeInTheDocument();
    expect(
      screen.getByText('진행 중인 작업이 있다면 저장한 뒤에 진행해주세요.'),
    ).toBeInTheDocument();
  });

  it('Cancel 클릭 시 logoutAndRefreshPage가 호출되지 않는다', async () => {
    const user = userEvent.setup();
    renderSideNav();

    await user.click(screen.getByRole('button', { name: '로그아웃' }));
    await screen.findByText('로그아웃 하시겠어요?');
    await user.click(screen.getByRole('button', { name: '취소' }));

    await waitFor(() => {
      expect(
        screen.queryByText('로그아웃 하시겠어요?'),
      ).not.toBeInTheDocument();
    });
    expect(logoutAndRefreshPageMock).not.toHaveBeenCalled();
  });

  it('Confirm 클릭 시 logoutAndRefreshPage가 호출된다', async () => {
    const user = userEvent.setup();
    renderSideNav();

    await user.click(screen.getByRole('button', { name: '로그아웃' }));
    await screen.findByText('로그아웃 하시겠어요?');
    // confirm 버튼 라벨이 "로그아웃"이라 nav 버튼과 동명. dialog 내부에서 선택.
    const dialog = screen.getByRole('alertdialog');
    const confirmButton = await waitFor(() =>
      dialog.querySelector('[data-variant="destructive"]'),
    );
    if (!confirmButton) throw new Error('confirm 버튼을 찾을 수 없음');
    await user.click(confirmButton as HTMLElement);

    await waitFor(() => {
      expect(logoutAndRefreshPageMock).toHaveBeenCalledTimes(1);
    });
  });
});
