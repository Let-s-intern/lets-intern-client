import { createV2Axios } from '@letscareer/api';
import { getAuthHeader, logoutAndRefreshPage } from './auth';

// env push2 이후 VITE_SERVER_API_V2 가 절대 URL 이라 baseURL 합성 불필요.
const axiosV2 = createV2Axios({
  getAuthHeader,
  onUnauthorized: logoutAndRefreshPage,
});

export default axiosV2;
