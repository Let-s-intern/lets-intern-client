import Axios, { AxiosError, AxiosHeaders } from 'axios';
import { createAuthorizedAxios } from './createAuthorizedAxios';
import { ApiError } from './errors';

function makeAxiosError(
  status: number,
  data: unknown,
  url = '/api/test',
  method = 'GET',
): AxiosError {
  const err = new AxiosError('Request failed', 'ERR_BAD_RESPONSE');
  err.response = {
    status,
    data,
    headers: {},
    config: {
      url,
      method,
      headers: new AxiosHeaders(),
    },
    statusText: String(status),
    request: null,
  } as AxiosError['response'];
  return err;
}

describe('createAuthorizedAxios', () => {
  it('4xx 응답이 ApiError로 변환된다', async () => {
    const instance = createAuthorizedAxios({ baseURL: 'https://api.test' });

    // axios 인터셉터를 직접 트리거
    const interceptor = (instance.interceptors.response as unknown as {
      handlers: Array<{
        fulfilled: ((v: unknown) => unknown) | null;
        rejected: ((e: unknown) => unknown) | null;
      }>;
    }).handlers.find((h) => h.rejected !== null);

    expect(interceptor).toBeTruthy();

    const axiosErr = makeAxiosError(404, { message: '리소스 없음' });
    await expect(interceptor!.rejected!(axiosErr)).rejects.toBeInstanceOf(ApiError);
  });

  it('5xx 응답이 ApiError로 변환된다', async () => {
    const instance = createAuthorizedAxios({ baseURL: 'https://api.test' });

    const interceptor = (instance.interceptors.response as unknown as {
      handlers: Array<{
        fulfilled: ((v: unknown) => unknown) | null;
        rejected: ((e: unknown) => unknown) | null;
      }>;
    }).handlers.find((h) => h.rejected !== null);

    const axiosErr = makeAxiosError(500, { message: '서버 내부 오류' });
    const result = interceptor!.rejected!(axiosErr);
    await expect(result).rejects.toSatisfy((err: unknown) => {
      if (!(err instanceof ApiError)) return false;
      expect(err.status).toBe(500);
      expect(err.serverMessage).toBe('서버 내부 오류');
      return true;
    });
  });

  it('401 + 토큰이 유효하지 않습니다 → onUnauthorized 호출 후 원본 에러 reject', async () => {
    const onUnauthorized = vi.fn();
    const instance = createAuthorizedAxios({
      baseURL: 'https://api.test',
      onUnauthorized,
    });

    const interceptor = (instance.interceptors.response as unknown as {
      handlers: Array<{
        fulfilled: ((v: unknown) => unknown) | null;
        rejected: ((e: unknown) => unknown) | null;
      }>;
    }).handlers.find((h) => h.rejected !== null);

    const axiosErr = makeAxiosError(401, { message: '토큰이 유효하지 않습니다' });
    await expect(interceptor!.rejected!(axiosErr)).rejects.toBe(axiosErr);
    expect(onUnauthorized).toHaveBeenCalledTimes(1);
  });

  it('401 + 다른 메시지 → ApiError로 변환된다', async () => {
    const onUnauthorized = vi.fn();
    const instance = createAuthorizedAxios({
      baseURL: 'https://api.test',
      onUnauthorized,
    });

    const interceptor = (instance.interceptors.response as unknown as {
      handlers: Array<{
        fulfilled: ((v: unknown) => unknown) | null;
        rejected: ((e: unknown) => unknown) | null;
      }>;
    }).handlers.find((h) => h.rejected !== null);

    const axiosErr = makeAxiosError(401, { message: '인증이 필요합니다' });
    await expect(interceptor!.rejected!(axiosErr)).rejects.toBeInstanceOf(ApiError);
    expect(onUnauthorized).not.toHaveBeenCalled();
  });

  it('응답에 code 가 있으면 ApiError.code 로 전달된다', async () => {
    const instance = createAuthorizedAxios({ baseURL: 'https://api.test' });

    const interceptor = (instance.interceptors.response as unknown as {
      handlers: Array<{
        fulfilled: ((v: unknown) => unknown) | null;
        rejected: ((e: unknown) => unknown) | null;
      }>;
    }).handlers.find((h) => h.rejected !== null);

    const axiosErr = makeAxiosError(400, {
      code: 'INVALID_AUTH_PROVIDER_KAKAO',
      message: '카카오 소셜 로그인으로 가입된 계정입니다.',
    });
    await expect(interceptor!.rejected!(axiosErr)).rejects.toSatisfy(
      (err: unknown) => {
        if (!(err instanceof ApiError)) return false;
        expect(err.code).toBe('INVALID_AUTH_PROVIDER_KAKAO');
        return true;
      },
    );
  });

  it('응답에 code 가 없으면 ApiError.code 는 fallback "API_ERROR" 로 설정된다', async () => {
    const instance = createAuthorizedAxios({ baseURL: 'https://api.test' });

    const interceptor = (instance.interceptors.response as unknown as {
      handlers: Array<{
        fulfilled: ((v: unknown) => unknown) | null;
        rejected: ((e: unknown) => unknown) | null;
      }>;
    }).handlers.find((h) => h.rejected !== null);

    const axiosErr = makeAxiosError(400, { message: '잘못된 요청입니다.' });
    await expect(interceptor!.rejected!(axiosErr)).rejects.toSatisfy(
      (err: unknown) => {
        if (!(err instanceof ApiError)) return false;
        expect(err.code).toBe('API_ERROR');
        return true;
      },
    );
  });

  it('중첩된 data.code 도 재귀로 추출한다', async () => {
    const instance = createAuthorizedAxios({ baseURL: 'https://api.test' });

    const interceptor = (instance.interceptors.response as unknown as {
      handlers: Array<{
        fulfilled: ((v: unknown) => unknown) | null;
        rejected: ((e: unknown) => unknown) | null;
      }>;
    }).handlers.find((h) => h.rejected !== null);

    const axiosErr = makeAxiosError(400, {
      data: { code: 'USER_NOT_FOUND', message: '존재하지 않는 사용자입니다.' },
    });
    await expect(interceptor!.rejected!(axiosErr)).rejects.toSatisfy(
      (err: unknown) => {
        if (!(err instanceof ApiError)) return false;
        expect(err.code).toBe('USER_NOT_FOUND');
        return true;
      },
    );
  });
});
