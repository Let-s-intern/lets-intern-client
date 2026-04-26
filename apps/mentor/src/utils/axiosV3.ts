import { createV3Axios } from '@letscareer/api';
import { getAuthHeader, logoutAndRefreshPage } from './auth';

const axiosV3 = createV3Axios({
  getAuthHeader,
  onUnauthorized: logoutAndRefreshPage,
});

export default axiosV3;
