import { createV2Axios } from '@letscareer/api';
import { getAuthHeader, logoutAndRefreshPage } from './auth';

// baseURL 은 반드시 literal access 로 넘긴다. packages/api/src/env.ts 의 dynamic
// access (readProcessEnv) 는 Next.js NEXT_PUBLIC_* 매크로 치환 대상이 아니라
// 브라우저에서 빈 문자열로 떨어진다.
const axiosV2 = createV2Axios({
  baseURL: process.env.NEXT_PUBLIC_SERVER_API_V2!,
  getAuthHeader,
  onUnauthorized: logoutAndRefreshPage,
});

export default axiosV2;
