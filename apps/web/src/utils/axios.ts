import { createDefaultAxios } from '@letscareer/api';
import { getAuthHeader, logoutAndRefreshPage } from './auth';

const axios = createDefaultAxios({
  baseURL: process.env.NEXT_PUBLIC_SERVER_API!,
  getAuthHeader,
  onUnauthorized: logoutAndRefreshPage,
});

export default axios;
