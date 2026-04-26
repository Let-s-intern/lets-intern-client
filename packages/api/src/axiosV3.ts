import {
  createAuthorizedAxios,
  type AuthHeaderResolver,
  type UnauthorizedHandler,
} from './createAuthorizedAxios';
import { SERVER_API_V3 } from './env';

export function createV3Axios(options?: {
  baseURL?: string;
  getAuthHeader?: AuthHeaderResolver;
  onUnauthorized?: UnauthorizedHandler;
}) {
  return createAuthorizedAxios({
    baseURL: options?.baseURL ?? SERVER_API_V3,
    getAuthHeader: options?.getAuthHeader,
    onUnauthorized: options?.onUnauthorized,
  });
}
