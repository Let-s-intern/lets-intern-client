import Axios, { AxiosError, AxiosHeaders, AxiosInstance } from 'axios';

import { auth } from './auth';

export type AuthorizedAxiosOptions = {
  baseURL: string;
};

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

const EXPIRY_THRESHOLD_MS = 30_000;

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
}: AuthorizedAxiosOptions): AxiosInstance {
  const instance = Axios.create({
    baseURL,
    headers: DEFAULT_HEADERS,
  });

  instance.interceptors.request.use(
    async (config) => {
      await auth.ensureValidAccessToken();
      const header = auth.getAuthHeader();
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
      if (error.response?.status === 401) {
        await auth.ready();
        const snapshot = auth.getTokens();
        if (!snapshot) {
          return Promise.reject(error);
        }

        const now = Date.now();

        if (snapshot.accessExpiresAt > now) {
          await auth.requireAuth('unexpected-401');
          return Promise.reject(error);
        }

        if (snapshot.refreshExpiresAt - now <= EXPIRY_THRESHOLD_MS) {
          await auth.requireAuth('refresh-expired');
          return Promise.reject(error);
        }

        const originalRequest = error.config;
        if (!originalRequest) {
          await auth.requireAuth('401');
          return Promise.reject(error);
        }

        if ((originalRequest as any).__isRetry) {
          await auth.requireAuth('401');
          return Promise.reject(error);
        }

        (originalRequest as any).__isRetry = true;

        const refreshed = await auth.refreshTokens();
        if (refreshed) {
          return instance.request(originalRequest);
        }

        return Promise.reject(error);
      }

      const message = extractErrorMessage(error.response?.data);
      if (message && message.includes('토큰이 유효하지 않습니다')) {
        await auth.requireAuth('invalid-token-error');
        return Promise.reject(error);
      }

      return Promise.reject(error);
    },
  );

  return instance;
}
