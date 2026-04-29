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
  const baseURL = options?.baseURL ?? SERVER_API_V3;
  if (!baseURL) {
    throw new Error(
      '[@letscareer/api] createV3Axios: baseURL is empty. ' +
        'Provide options.baseURL or set NEXT_PUBLIC_SERVER_API_V3 / VITE_SERVER_API_V3.',
    );
  }
  return createAuthorizedAxios({
    baseURL,
    getAuthHeader: options?.getAuthHeader,
    onUnauthorized: options?.onUnauthorized,
  });
}
