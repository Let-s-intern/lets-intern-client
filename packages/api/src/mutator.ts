import {
  createAuthorizedAxios,
  type AuthHeaderResolver,
  type UnauthorizedHandler,
} from './createAuthorizedAxios';
import { SERVER_API } from './env';
import type { AxiosRequestConfig } from 'axios';

let cachedAxios: ReturnType<typeof createAuthorizedAxios> | null = null;

export function configureGeneratedAxios(options: {
  baseURL?: string;
  getAuthHeader?: AuthHeaderResolver;
  onUnauthorized?: UnauthorizedHandler;
}) {
  cachedAxios = createAuthorizedAxios({
    baseURL: options.baseURL ?? SERVER_API,
    getAuthHeader: options.getAuthHeader,
    onUnauthorized: options.onUnauthorized,
  });
}

export const customAxios = async <T>(
  config: AxiosRequestConfig,
): Promise<T> => {
  if (!cachedAxios) {
    throw new Error(
      '[@letscareer/api] customAxios: configureGeneratedAxios()를 앱 초기화 시점에 호출해야 합니다.',
    );
  }
  // envelope 언래핑: { data: T } → T (Phase 0 검증 후 결정)
  const res = await cachedAxios.request<{ data: T } | T>(config);
  const body = res.data as { data?: T };
  return (body?.data ?? body) as T;
};

export default customAxios;
