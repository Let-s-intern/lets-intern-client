import {
  createAuthorizedAxios,
  type AuthHeaderResolver,
  type UnauthorizedHandler,
} from './createAuthorizedAxios';
import { API_BASE_PATH } from './env';

export function buildV2BaseUrl(basePath: string = API_BASE_PATH): string {
  return basePath.endsWith('/') ? `${basePath}api/v2` : `${basePath}/api/v2`;
}

export function createV2Axios(options?: {
  basePath?: string;
  getAuthHeader?: AuthHeaderResolver;
  onUnauthorized?: UnauthorizedHandler;
}) {
  return createAuthorizedAxios({
    baseURL: buildV2BaseUrl(options?.basePath),
    getAuthHeader: options?.getAuthHeader,
    onUnauthorized: options?.onUnauthorized,
  });
}
