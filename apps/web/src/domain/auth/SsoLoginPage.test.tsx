// 패키지 entry(@letscareer/api) 는 env.ts 의 import.meta 때문에 jest 환경에서
// SyntaxError 가 발생한다. ApiError 클래스만 필요하므로 errors 서브경로를 직접
// import 해서 패키지 entry 로드를 우회한다 (package.json exports "./*").
import { ApiError } from '@letscareer/api/errors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

function makeApiError(
  status: number,
  code: string,
  message: string,
): ApiError {
  return new ApiError({
    code,
    message,
    status,
    endpoint: '/sso/authenticate',
    method: 'POST',
    serverMessage: message,
    context: {},
  });
}

let mockSearchParams = new URLSearchParams();
jest.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
}));

const postMock = jest.fn();
jest.mock('../../utils/axios', () => ({
  __esModule: true,
  default: {
    post: (...args: unknown[]) => postMock(...args),
  },
}));

// captureError.ts 는 @letscareer/api 패키지 entry(env.ts 의 import.meta)를 그대로
// 끌고 와 jest 에서 SyntaxError 를 낸다. 여기서는 Sentry 전송 여부를 검증하지
// 않으므로 통째로 막는다.
jest.mock('../../utils/captureError', () => ({
  captureAuthError: jest.fn(),
}));

import SsoLoginPage from './SsoLoginPage';

const VOD_CALLBACK = 'https://vod.letscareer.co.kr/auth/callback';

function renderSsoLoginPage() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: 0 }, queries: { retry: 0 } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <SsoLoginPage />
    </QueryClientProvider>,
  );
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('이메일'), 'user@letscareer.co.kr');
  await user.type(screen.getByLabelText('비밀번호'), 'password!1');
}

describe('SsoLoginPage', () => {
  beforeEach(() => {
    postMock.mockReset();
    mockSearchParams = new URLSearchParams({ redirect_uri: VOD_CALLBACK });
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, href: '' },
    });
  });

  it('redirect_uri 쿼리 파라미터가 없으면 로그인 폼을 보여주지 않고 안내만 보여준다', () => {
    mockSearchParams = new URLSearchParams();
    renderSsoLoginPage();

    expect(screen.getByText('잘못된 접근입니다')).toBeInTheDocument();
    expect(screen.queryByLabelText('이메일')).not.toBeInTheDocument();
  });

  it('정상 응답이면 응답의 redirectUrl로 이동한다', async () => {
    const user = userEvent.setup();
    // axios 응답 → SuccessResponse{status,message,data} → data.redirectUrl.
    postMock.mockResolvedValue({
      data: {
        status: 200,
        message: 'OK',
        data: {
          redirectUrl: `${VOD_CALLBACK}?token=access.jwt&refreshToken=refresh.jwt`,
        },
      },
    });
    renderSsoLoginPage();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: '로그인' }));

    await waitFor(() => {
      expect(window.location.href).toBe(
        `${VOD_CALLBACK}?token=access.jwt&refreshToken=refresh.jwt`,
      );
    });
    expect(postMock).toHaveBeenCalledWith('/sso/authenticate', {
      email: 'user@letscareer.co.kr',
      password: 'password!1',
      redirectUri: VOD_CALLBACK,
    });
  });

  it('자격 증명이 틀리면 중립적인 에러 문구를 보여주고 이동하지 않는다', async () => {
    const user = userEvent.setup();
    postMock.mockRejectedValue(
      makeApiError(400, 'SSO_INVALID_CREDENTIALS', '이메일 또는 비밀번호가 올바르지 않습니다.'),
    );
    renderSsoLoginPage();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: '로그인' }));

    expect(
      await screen.findByText('이메일 또는 비밀번호가 일치하지 않습니다.'),
    ).toBeInTheDocument();
    expect(window.location.href).toBe('');
  });

  it('화이트리스트에 없는 서비스면 폼을 숨기고 재시도를 막는다', async () => {
    const user = userEvent.setup();
    postMock.mockRejectedValue(
      makeApiError(400, 'SSO_REDIRECT_URI_MISMATCH', '허용되지 않은 리다이렉트 URI입니다.'),
    );
    renderSsoLoginPage();

    await fillValidForm(user);
    await user.click(screen.getByRole('button', { name: '로그인' }));

    expect(
      await screen.findByText(
        '등록되지 않은 서비스입니다. 서비스 운영자에게 문의해주세요.',
      ),
    ).toBeInTheDocument();
    // 폼이 사라져 재시도(재제출) 자체가 불가능해야 한다 — 같은 redirect_uri로는 다시 시도해도 똑같이 막힌다.
    expect(screen.queryByLabelText('이메일')).not.toBeInTheDocument();
    expect(window.location.href).toBe('');
  });

  it('이메일/비밀번호를 입력하기 전에는 제출해도 API를 호출하지 않는다', async () => {
    // 이 저장소의 Button 컴포넌트는 disabled를 style-only로 처리하고 네이티브
    // disabled 속성을 달지 않는다 — 그래서 클릭 후 동작으로 검증한다.
    const user = userEvent.setup();
    renderSsoLoginPage();

    await user.click(screen.getByRole('button', { name: '로그인' }));

    expect(postMock).not.toHaveBeenCalled();
  });
});
