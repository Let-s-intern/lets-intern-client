import { Limiter } from '@/lib/Limiter';
import Axios, { AxiosError } from 'axios';
import useAuthStore from '../store/useAuthStore';

const limiter = new Limiter();

const reissuer = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const initAuth = () => {
  useAuthStore.setState({
    accessToken: undefined,
    refreshToken: undefined,
    isLoggedIn: false,
  });
};

// 🔥 v1용 single-flight 플래그
let isRefreshingV1 = false;

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const accessToken = useAuthStore.getState().accessToken;
    const refreshToken = useAuthStore.getState().refreshToken;

    // 🔥 빈 토큰일 때는 Authorization 헤더를 아예 보내지 않음
    if (accessToken && refreshToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      const originalRequest = { ...error.config };
      const refreshToken = useAuthStore.getState().refreshToken;

      if (!refreshToken) {
        initAuth();
        return Promise.reject(error);
      }

      // 🔥 이미 리프레시 중이면 그냥 실패 처리
      if (isRefreshingV1) {
        return Promise.reject(error);
      }

      // 리프레시 시작
      isRefreshingV1 = true;

      try {
        const res = await reissuer.patch('/user/token', { refreshToken });
        useAuthStore.setState({
          accessToken: res.data.data.accessToken,
          refreshToken: res.data.data.refreshToken,
          isLoggedIn: true,
        });

        // 원본 요청만 재시도
        return axios(originalRequest);
      } catch (error) {
        initAuth();
        return Promise.reject(error);
      } finally {
        // 🔥 리프레시 완료 후 플래그 해제
        isRefreshingV1 = false;
      }
    } else {
      // 로그인 상태라면 무조건 성공해야 할 API(/api/v1/user) 가 알 수 없는 이유로 실패했을 때는 로그아웃 시킴
      const req = error.request as XMLHttpRequest | undefined;
      if (req && req.responseURL && req.responseURL.endsWith('/api/v1/user')) {
        initAuth();
      }
    }

    return Promise.reject(error);
  },
);

export default axios;
