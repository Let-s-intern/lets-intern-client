import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';

import axios from '@/utils/axios';
import { ApiError } from '@letscareer/api';

import VersionChangeModal from './VersionChangeModal';

// application.ts 가 @letscareer/api(import.meta 사용)를 임포트 그래프로 물고 있어 모킹한다.
// 모달이 instanceof 로 검사하므로 ApiError 도 같은 모듈에서 내보낸다.
jest.mock('@letscareer/api', () => {
  class ApiError extends Error {
    serverMessage?: string;
    constructor(opts: { message: string; serverMessage?: string }) {
      super(opts.message);
      this.serverMessage = opts.serverMessage;
    }
  }
  return {
    ApiError,
    createDefaultAxios: jest.fn(() => ({})),
    createV2Axios: jest.fn(() => ({})),
    fetchJson: jest.fn(),
  };
});
jest.mock('@/utils/axios', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), patch: jest.fn() },
}));
jest.mock('@/utils/axiosV2', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), patch: jest.fn() },
}));

const axiosGet = axios.get as jest.Mock;
const axiosPatch = axios.patch as jest.Mock;

const VERSION = {
  currentVersion: { challengeVersionId: 1, title: '대학생' },
  versionList: [
    { challengeVersionId: 1, title: '대학생' },
    { challengeVersionId: 2, title: '이직자' },
  ],
  deadline: '2026-09-20T23:59:00',
  changeable: true,
  unavailableReason: null,
};

function renderModal() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const onClose = jest.fn();
  render(
    <QueryClientProvider client={client}>
      <VersionChangeModal applicationId="7" onClose={onClose} />
    </QueryClientProvider>,
  );
  return { onClose };
}

beforeEach(() => {
  axiosGet.mockReset();
  axiosPatch.mockReset();
  axiosGet.mockResolvedValue({ data: { data: VERSION } });
});

describe('대시보드 VersionChangeModal', () => {
  it('마감 시각 안내와 현재 버전 뱃지를 보여 준다', async () => {
    renderModal();

    expect(await screen.findByRole('radio', { name: /대학생/ })).toBeChecked();
    expect(
      screen.getByText(
        '버전은 한 번만 바꿀 수 있어요. 9월 20일 23:59까지 변경할 수 있어요.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('현재')).toBeInTheDocument();
  });

  it('현재와 같은 버전이면 변경하기가 비활성이다', async () => {
    renderModal();
    const submit = screen.getByRole('button', { name: '변경하기' });

    await screen.findByRole('radio', { name: /대학생/ });
    expect(submit).toBeDisabled();

    fireEvent.click(screen.getByRole('radio', { name: /이직자/ }));
    expect(submit).toBeEnabled();

    fireEvent.click(screen.getByRole('radio', { name: /대학생/ }));
    expect(submit).toBeDisabled();
  });

  it('요청 중에는 변경하기가 비활성이다', async () => {
    axiosPatch.mockReturnValue(new Promise(() => {}));
    renderModal();

    fireEvent.click(await screen.findByRole('radio', { name: /이직자/ }));
    const submit = screen.getByRole('button', { name: '변경하기' });
    fireEvent.click(submit);
    fireEvent.click(screen.getByRole('button', { name: '변경' }));

    await waitFor(() => expect(submit).toBeDisabled());
  });

  it('실패하면 서버 문구를 보여 주고 모달을 유지한다', async () => {
    axiosPatch.mockRejectedValue(
      new ApiError({
        code: 'VERSION_ALREADY_CHANGED',
        message: '서버 오류가 발생했습니다.',
        status: 409,
        endpoint: '/application/7/version',
        method: 'PATCH',
        serverMessage: '버전은 한 번만 변경할 수 있습니다.',
      }),
    );
    const { onClose } = renderModal();

    fireEvent.click(await screen.findByRole('radio', { name: /이직자/ }));
    fireEvent.click(screen.getByRole('button', { name: '변경하기' }));
    fireEvent.click(screen.getByRole('button', { name: '변경' }));

    expect(
      await screen.findByText('버전은 한 번만 변경할 수 있습니다.'),
    ).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByText('버전 변경')).toBeInTheDocument();
  });

  it('성공하면 고른 버전으로 요청하고 닫는다', async () => {
    axiosPatch.mockResolvedValue({ data: { data: null } });
    const { onClose } = renderModal();

    fireEvent.click(await screen.findByRole('radio', { name: /이직자/ }));
    fireEvent.click(screen.getByRole('button', { name: '변경하기' }));
    fireEvent.click(screen.getByRole('button', { name: '변경' }));

    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
    expect(axiosPatch).toHaveBeenCalledWith('/application/7/version', {
      challengeVersionId: 2,
    });
  });
  it('변경하기를 누르면 다시 바꾸기 어렵다는 알럿을 띄우고, 취소하면 요청하지 않는다', async () => {
    renderModal();

    fireEvent.click(await screen.findByRole('radio', { name: /이직자/ }));
    fireEvent.click(screen.getByRole('button', { name: '변경하기' }));

    expect(screen.getByText('버전을 변경할까요?')).toBeInTheDocument();
    expect(
      screen.getByText(/이직자 버전으로 변경하면 다시 변경하기 어려워요/),
    ).toBeInTheDocument();

    // 모달에도 취소가 있어 알럿 안에서만 찾는다
    const alert = screen.getByText('버전을 변경할까요?')
      .parentElement as HTMLElement;
    fireEvent.click(within(alert).getByRole('button', { name: '취소' }));
    expect(screen.queryByText('버전을 변경할까요?')).toBeNull();
    expect(axiosPatch).not.toHaveBeenCalled();
  });

  it('현재 버전이 없으면 뱃지 없이 열고, 아무 버전이나 고르면 변경하기가 활성이다', async () => {
    axiosGet.mockResolvedValue({
      data: { data: { ...VERSION, currentVersion: null } },
    });
    renderModal();
    const submit = screen.getByRole('button', { name: '변경하기' });

    expect(
      await screen.findByRole('radio', { name: /대학생/ }),
    ).not.toBeChecked();
    expect(screen.getByRole('radio', { name: /이직자/ })).not.toBeChecked();
    expect(screen.queryByText('현재')).toBeNull();
    expect(submit).toBeDisabled();

    fireEvent.click(screen.getByRole('radio', { name: /대학생/ }));
    expect(submit).toBeEnabled();
  });
});
