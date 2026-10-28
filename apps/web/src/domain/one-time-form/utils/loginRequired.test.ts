import { ApiError } from '@letscareer/api/errors';
import { buildLoginPath, isLoginRequiredError } from './loginRequired';

const apiError = (status: number) =>
  new ApiError({
    code: 'API_ERROR',
    message: '서버 오류가 발생했습니다.',
    status,
    endpoint: '/one-time-form/portfolio-1115/my',
    method: 'GET',
  });

describe('isLoginRequiredError', () => {
  it.each([401, 403])('%i 응답이면 true', (status) => {
    expect(isLoginRequiredError(apiError(status))).toBe(true);
  });

  it.each([400, 404, 500])('%i 응답이면 false', (status) => {
    expect(isLoginRequiredError(apiError(status))).toBe(false);
  });

  it('응답 없는 네트워크 실패와 ApiError 가 아닌 값은 false', () => {
    expect(isLoginRequiredError(new Error('Network Error'))).toBe(false);
    expect(isLoginRequiredError(undefined)).toBe(false);
    expect(isLoginRequiredError({ status: 403 })).toBe(false);
  });
});

describe('buildLoginPath', () => {
  it('돌아올 경로를 쿼리째 인코딩해 redirect 에 담는다', () => {
    expect(buildLoginPath('/form/portfolio-1115/payment?a=1&b=2')).toBe(
      '/login?redirect=%2Fform%2Fportfolio-1115%2Fpayment%3Fa%3D1%26b%3D2',
    );
  });
});
