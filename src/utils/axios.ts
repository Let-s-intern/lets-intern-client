import Axios from 'axios';

const axios = Axios.create();

const accessToken = localStorage.getItem('access-token');
const refreshToken = localStorage.getItem('refresh-token');

axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_SERVER_API}`;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common.Authorization =
  accessToken && refreshToken ? `Bearer ${accessToken}` : '';

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      const originalRequest = error.config;
      const refreshToken = localStorage.getItem('refresh-token');
      try {
        const res = await axios.patch(
          '/user/token',
          {
            refreshToken,
          },
          {
            headers: {
              Authorization: '',
            },
          },
        );
        localStorage.setItem('access-token', res.data.data.accessToken);
        localStorage.setItem('refresh-token', res.data.data.refreshToken);
        axios.defaults.headers.common.Authorization = `Bearer ${res.data.data.accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${res.data.data.accessToken}`;
        return axios(originalRequest);
      } catch (err: any) {
        if (err.response.status === 404) {
          localStorage.removeItem('access-token');
          localStorage.removeItem('refresh-token');
          window.location.reload();
        } else if (err.response.status === 500) {
          localStorage.removeItem('access-token');
          localStorage.removeItem('refresh-token');
          window.location.reload();
        }
      }
    }
    return Promise.reject(error);
  },
);

export default axios;
