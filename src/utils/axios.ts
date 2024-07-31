import Axios, { AxiosError } from 'axios';
import useAuthStore from '../store/useAuthStore';

const reissuer = Axios.create({
  baseURL: import.meta.env.VITE_SERVER_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

const axios = Axios.create({
  baseURL: import.meta.env.VITE_SERVER_API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const accessToken = useAuthStore.getState().accessToken;
    const refreshToken = useAuthStore.getState().refreshToken;
    config.headers.Authorization = config.headers.Authorization
      ? config.headers.Authorization
      : accessToken && refreshToken
        ? `Bearer ${accessToken}`
        : '';
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
        useAuthStore.setState({
          accessToken: undefined,
          refreshToken: undefined,
          isLoggedIn: false,
        });
        return Promise.reject(error);
      }

      try {
        const res = await reissuer.patch('/user/token', { refreshToken });
        useAuthStore.setState({
          accessToken: res.data.data.accessToken,
          refreshToken: res.data.data.refreshToken,
          isLoggedIn: true,
        });
        return axios(originalRequest);
      } catch (error) {
        useAuthStore.setState({
          accessToken: undefined,
          refreshToken: undefined,
          isLoggedIn: false,
        });
        return Promise.reject(error);
      }
    } else {
      // 로그인 상태라면 무조건 성공해야 할 API(/api/v1/user) 가 알 수 없는 이유로 실패했을 때는 로그아웃 시킴
      const req = error.request as XMLHttpRequest | undefined;
      if (req && req.responseURL && req.responseURL.endsWith('/api/v1/user')) {
        useAuthStore.setState({
          accessToken: undefined,
          refreshToken: undefined,
          isLoggedIn: false,
        });
      }
    }

    return Promise.reject(error);
  },
);

export default axios;
