import {
  createAuthorizedAxios as baseCreateAuthorizedAxios,
  type AuthorizedAxiosOptions as BaseOptions,
} from '@letscareer/api';
import { getAuthHeader, logoutAndRefreshPage } from './auth';

export type AuthorizedAxiosOptions = Pick<BaseOptions, 'baseURL'>;

export function createAuthorizedAxios({ baseURL }: AuthorizedAxiosOptions) {
  return baseCreateAuthorizedAxios({
    baseURL,
    getAuthHeader,
    onUnauthorized: logoutAndRefreshPage,
  });
}
