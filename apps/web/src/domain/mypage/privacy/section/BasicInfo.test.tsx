import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const patchMock = jest.fn();
const getMock = jest.fn();
jest.mock('../../../../utils/axios', () => ({
  __esModule: true,
  default: {
    patch: (...args: unknown[]) => patchMock(...args),
    get: (...args: unknown[]) => getMock(...args),
  },
}));

// useUserQuery는 user 객체를 직접 stub.
// useEffect 무한 루프 방지를 위해 동일 객체 참조를 유지한다.
jest.mock('@/api/user/user', () => {
  const stub = {
    data: {
      name: '홍길동',
      phoneNum: '010-1234-5678',
      email: 'test@example.com',
      contactEmail: 'test@example.com',
      authProvider: 'EMAIL',
    },
  };
  return {
    useUserQueryKey: 'useUserQueryKey',
    useUserQuery: () => stub,
  };
});

// useToast는 BasicInfo 외부에서 발화 사실만 검증하면 충분하므로 spy로 대체.
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

import BasicInfo from './BasicInfo';

function renderBasicInfo() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: 0 }, queries: { retry: 0 } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <BasicInfo />
    </QueryClientProvider>,
  );
}

describe('BasicInfo confirm', () => {
  beforeEach(() => {
    patchMock.mockReset();
    patchMock.mockResolvedValue({ data: {} });
    toastSuccessMock.mockReset();
    toastErrorMock.mockReset();
  });

  it('수정하기 버튼 클릭 시 EditConfirmDialog가 노출된다', async () => {
    const user = userEvent.setup();
    renderBasicInfo();

    await user.click(
      screen.getByRole('button', { name: '기본 정보 수정하기' }),
    );

    expect(
      await screen.findByText('기본 정보를 수정하시겠어요?'),
    ).toBeInTheDocument();
    expect(screen.getByText('입력한 정보로 변경됩니다.')).toBeInTheDocument();
    expect(patchMock).not.toHaveBeenCalled();
  });

  it('Cancel 클릭 시 PATCH /user 가 호출되지 않는다', async () => {
    const user = userEvent.setup();
    renderBasicInfo();

    await user.click(
      screen.getByRole('button', { name: '기본 정보 수정하기' }),
    );
    await screen.findByText('기본 정보를 수정하시겠어요?');
    await user.click(screen.getByRole('button', { name: '취소' }));

    await waitFor(() => {
      expect(
        screen.queryByText('기본 정보를 수정하시겠어요?'),
      ).not.toBeInTheDocument();
    });
    expect(patchMock).not.toHaveBeenCalled();
  });

  it('Confirm 클릭 시 PATCH /user 가 호출된다', async () => {
    const user = userEvent.setup();
    renderBasicInfo();

    await user.click(
      screen.getByRole('button', { name: '기본 정보 수정하기' }),
    );
    await screen.findByText('기본 정보를 수정하시겠어요?');
    await user.click(screen.getByRole('button', { name: '수정' }));

    await waitFor(() => {
      expect(patchMock).toHaveBeenCalledWith(
        '/user',
        expect.objectContaining({
          name: '홍길동',
          phoneNum: '010-1234-5678',
          email: 'test@example.com',
        }),
      );
    });
  });
});

describe('BasicInfo toast', () => {
  beforeEach(() => {
    patchMock.mockReset();
    toastSuccessMock.mockReset();
    toastErrorMock.mockReset();
  });

  it('mutation 성공 시 toast.success가 호출된다', async () => {
    const user = userEvent.setup();
    patchMock.mockResolvedValue({ data: {} });
    renderBasicInfo();

    await user.click(
      screen.getByRole('button', { name: '기본 정보 수정하기' }),
    );
    await screen.findByText('기본 정보를 수정하시겠어요?');
    await user.click(screen.getByRole('button', { name: '수정' }));

    await waitFor(() => {
      expect(toastSuccessMock).toHaveBeenCalledWith('정보가 수정되었습니다');
    });
    expect(toastErrorMock).not.toHaveBeenCalled();
  });

  it('mutation 실패 시 toast.error가 호출된다', async () => {
    const user = userEvent.setup();
    patchMock.mockRejectedValue(new Error('서버 오류'));
    // console.error 호출을 가린다 (BasicInfo onError에서 호출)
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    renderBasicInfo();

    await user.click(
      screen.getByRole('button', { name: '기본 정보 수정하기' }),
    );
    await screen.findByText('기본 정보를 수정하시겠어요?');
    await user.click(screen.getByRole('button', { name: '수정' }));

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith('정보 수정에 실패했습니다');
    });
    consoleErrorSpy.mockRestore();
  });
});
