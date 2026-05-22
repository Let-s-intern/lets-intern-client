// 패키지 entry(@letscareer/api) 는 env.ts 의 import.meta 때문에 jest 환경에서
// SyntaxError 가 발생한다. ApiError 클래스만 필요하므로 errors 서브경로를 직접
// import 해서 패키지 entry 로드를 우회한다 (package.json exports "./*").
import { ApiError } from '@letscareer/api/errors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

function makeApiError(status: number, message: string): ApiError {
  return new ApiError({
    code: 'API_ERROR',
    message,
    status,
    endpoint: '/user/password',
    method: 'PATCH',
    serverMessage: message,
    context: {},
  });
}

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

  it('mutation 성공 시 success toast가 호출된다', async () => {
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
        expect.objectContaining({ description: expect.any(String) }),
      );
    });
    expect(toastErrorMock).not.toHaveBeenCalled();
  });

  it('400 + 메시지 "비밀번호가 일치하지 않습니다" 시 기존 비번 불일치 toast', async () => {
    const user = userEvent.setup();
    patchMock.mockRejectedValue(
      makeApiError(400, '비밀번호가 일치하지 않습니다.'),
    );
    renderChangePassword();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: '비밀번호 변경' }));
    await screen.findByText('비밀번호를 변경하시겠어요?');
    await user.click(screen.getByRole('button', { name: '변경' }));

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith(
        '기존 비밀번호가 일치하지 않아요',
        expect.objectContaining({
          description: expect.stringContaining('기존 비밀번호'),
        }),
      );
    });
  });

  it('400 + 메시지 "비밀번호 형식이 잘못되었습니다" 시 형식 위반 toast', async () => {
    const user = userEvent.setup();
    patchMock.mockRejectedValue(
      makeApiError(400, '비밀번호 형식이 잘못되었습니다.'),
    );
    renderChangePassword();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: '비밀번호 변경' }));
    await screen.findByText('비밀번호를 변경하시겠어요?');
    await user.click(screen.getByRole('button', { name: '변경' }));

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith(
        '새 비밀번호 형식이 올바르지 않아요',
        expect.objectContaining({
          description: expect.stringContaining('특수문자'),
        }),
      );
    });
  });

  it('500 status 시 서버 오류 toast', async () => {
    const user = userEvent.setup();
    patchMock.mockRejectedValue(makeApiError(500, '서버 오류'));
    renderChangePassword();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: '비밀번호 변경' }));
    await screen.findByText('비밀번호를 변경하시겠어요?');
    await user.click(screen.getByRole('button', { name: '변경' }));

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith(
        '서버에 일시적인 문제가 발생했어요',
        expect.objectContaining({ description: expect.any(String) }),
      );
    });
  });

  it('새 비밀번호와 확인이 불일치하면 검증 error toast 호출 + confirm 미노출', async () => {
    const user = userEvent.setup();
    renderChangePassword();

    await user.type(screen.getByLabelText('기존 비밀번호'), 'oldPass123!');
    await user.type(screen.getByLabelText('새로운 비밀번호'), 'newPass456!');
    await user.type(screen.getByLabelText('비밀번호 확인'), 'mismatch!');
    await user.click(screen.getByRole('button', { name: '비밀번호 변경' }));

    expect(toastErrorMock).toHaveBeenCalledWith(
      '새 비밀번호와 확인이 일치하지 않아요',
      expect.objectContaining({ description: expect.any(String) }),
    );
    expect(
      screen.queryByText('비밀번호를 변경하시겠어요?'),
    ).not.toBeInTheDocument();
    expect(patchMock).not.toHaveBeenCalled();
  });

  it('기존 비밀번호와 새 비밀번호가 같으면 검증 error toast 호출 + confirm 미노출', async () => {
    const user = userEvent.setup();
    renderChangePassword();

    await user.type(screen.getByLabelText('기존 비밀번호'), 'samePass1!');
    await user.type(screen.getByLabelText('새로운 비밀번호'), 'samePass1!');
    await user.type(screen.getByLabelText('비밀번호 확인'), 'samePass1!');
    await user.click(screen.getByRole('button', { name: '비밀번호 변경' }));

    expect(toastErrorMock).toHaveBeenCalledWith(
      '새 비밀번호가 기존과 동일해요',
      expect.objectContaining({ description: expect.any(String) }),
    );
    expect(
      screen.queryByText('비밀번호를 변경하시겠어요?'),
    ).not.toBeInTheDocument();
    expect(patchMock).not.toHaveBeenCalled();
  });
});
