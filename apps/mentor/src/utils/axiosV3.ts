import { createV3Axios } from '@letscareer/api';
import { getAuthHeader, logoutAndRefreshPage } from './auth';

// baseURL 은 반드시 literal access 로 넘긴다 (axiosV2.ts 주석 참고).
const axiosV3 = createV3Axios({
  baseURL: import.meta.env.VITE_SERVER_API_V3!,
  getAuthHeader,
  onUnauthorized: logoutAndRefreshPage,
});

export default axiosV3;
