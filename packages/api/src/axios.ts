import {
  createAuthorizedAxios,
  type AuthHeaderResolver,
  type UnauthorizedHandler,
} from './createAuthorizedAxios';
import { SERVER_API } from './env';

export function createDefaultAxios(options?: {
  baseURL?: string;
  getAuthHeader?: AuthHeaderResolver;
  onUnauthorized?: UnauthorizedHandler;
}) {
  return createAuthorizedAxios({
    baseURL: options?.baseURL ?? SERVER_API,
    getAuthHeader: options?.getAuthHeader,
    onUnauthorized: options?.onUnauthorized,
  });
}
