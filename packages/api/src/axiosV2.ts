import {
  createAuthorizedAxios,
  type AuthHeaderResolver,
  type UnauthorizedHandler,
} from './createAuthorizedAxios';
import { SERVER_API_V2 } from './env';

/**
 * @deprecated env push2 이후 SERVER_API_V2 가 절대 URL 형태로 들어와
 * baseURL 합성이 불필요. 잔존 호출처 정리 후 삭제 예정.
 */
export function buildV2BaseUrl(basePath: string = ''): string {
  return basePath
    ? basePath.endsWith('/')
      ? `${basePath}api/v2`
      : `${basePath}/api/v2`
    : SERVER_API_V2;
}

export function createV2Axios(options?: {
  baseURL?: string;
  getAuthHeader?: AuthHeaderResolver;
  onUnauthorized?: UnauthorizedHandler;
}) {
  const baseURL = options?.baseURL ?? SERVER_API_V2;
  if (!baseURL) {
    throw new Error(
      '[@letscareer/api] createV2Axios: baseURL is empty. ' +
        'Provide options.baseURL or set NEXT_PUBLIC_SERVER_API_V2 / VITE_SERVER_API_V2.',
    );
  }
  return createAuthorizedAxios({
    baseURL,
    getAuthHeader: options?.getAuthHeader,
    onUnauthorized: options?.onUnauthorized,
  });
}
