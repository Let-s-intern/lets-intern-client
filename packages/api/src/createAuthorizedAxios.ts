import Axios, { AxiosError, AxiosHeaders, AxiosInstance } from 'axios';
import { ApiError } from './errors';

export type AuthHeaderResolver = () => Promise<{ Authorization: string } | null>;
export type UnauthorizedHandler = () => void;

export type AuthorizedAxiosOptions = {
  baseURL: string;
  getAuthHeader?: AuthHeaderResolver;
  onUnauthorized?: UnauthorizedHandler;
};

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

function extractErrorMessage(data: unknown, depth = 0): string | null {
  if (data == null || depth > 3) return null;
  if (typeof data === 'string') {
    return data;
  }
  if (typeof data === 'object') {
    const record = data as Record<string, unknown>;
    for (const key of ['message', 'error', 'msg', 'detail']) {
      const value = record[key];
      if (typeof value === 'string') {
        return value;
      }
    }
    if ('data' in record) {
      return extractErrorMessage(record.data, depth + 1);
    }
  }
  return null;
}

export function createAuthorizedAxios({
  baseURL,
  getAuthHeader,
  onUnauthorized,
}: AuthorizedAxiosOptions): AxiosInstance {
  const instance = Axios.create({
    baseURL,
    headers: DEFAULT_HEADERS,
  });

  instance.interceptors.request.use(
    async (config) => {
      if (!getAuthHeader) return config;
      const header = await getAuthHeader();
      if (header) {
        const headers =
          config.headers instanceof AxiosHeaders
            ? config.headers
            : AxiosHeaders.from(config.headers ?? {});
        headers.set('Authorization', header.Authorization);
        config.headers = headers;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (
        error.response?.status === 401 &&
        extractErrorMessage(error.response.data)?.includes(
          '토큰이 유효하지 않습니다',
        )
      ) {
        onUnauthorized?.();
        return Promise.reject(error);
      }

      if (error.response) {
        const { status, config: axiosConfig, data } = error.response;
        const endpoint = axiosConfig?.url ?? '';
        const method = (axiosConfig?.method ?? 'GET').toUpperCase();
        const serverMessage = extractErrorMessage(data) ?? undefined;
        const apiError = new ApiError({
          code: 'API_ERROR',
          message: serverMessage ?? '서버 오류가 발생했습니다.',
          status,
          endpoint,
          method,
          serverMessage,
          context: {},
          cause: error,
        });
        return Promise.reject(apiError);
      }

      return Promise.reject(error);
    },
  );

  return instance;
}
