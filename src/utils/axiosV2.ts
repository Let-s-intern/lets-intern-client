import { createAuthorizedAxios } from './createAuthorizedAxios';

const axiosV2 = createAuthorizedAxios({
  baseURL: buildV2BaseUrl(),
});

function buildV2BaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_PATH!;
  return base.endsWith('/') ? `${base}api/v2` : `${base}/api/v2`;
}

export default axiosV2;
