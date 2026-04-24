import { createDefaultAxios } from '@letscareer/api';
import { getAuthHeader, logoutAndRefreshPage } from './auth';

const axios = createDefaultAxios({
  baseURL: import.meta.env.VITE_SERVER_API!,
  getAuthHeader,
  onUnauthorized: logoutAndRefreshPage,
});

export default axios;
