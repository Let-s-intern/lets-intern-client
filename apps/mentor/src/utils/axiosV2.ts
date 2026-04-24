import { createV2Axios } from '@letscareer/api';
import { getAuthHeader, logoutAndRefreshPage } from './auth';

const axiosV2 = createV2Axios({
  basePath: import.meta.env.VITE_API_BASE_PATH!,
  getAuthHeader,
  onUnauthorized: logoutAndRefreshPage,
});

export default axiosV2;
