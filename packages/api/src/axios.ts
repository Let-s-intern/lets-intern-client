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
  const baseURL = options?.baseURL ?? SERVER_API;
  if (!baseURL) {
    throw new Error(
      '[@letscareer/api] createDefaultAxios: baseURL is empty. ' +
        'Provide options.baseURL or set NEXT_PUBLIC_SERVER_API / VITE_SERVER_API.',
    );
  }
  return createAuthorizedAxios({
    baseURL,
    getAuthHeader: options?.getAuthHeader,
    onUnauthorized: options?.onUnauthorized,
  });
}
