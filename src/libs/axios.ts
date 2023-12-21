import Axios from 'axios';

const axios = Axios.create();

const accessToken = localStorage.getItem('access-token');
const refreshToken = localStorage.getItem('refresh-token');

axios.defaults.baseURL = `${process.env.REACT_APP_SERVER_API}`;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common.Authorization =
  accessToken && refreshToken
    ? `Bearer ${localStorage.getItem('access-token')}`
    : '';

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      if (error.response.data.code === 'AUTH_401_2') {
        const originalRequest = error.config;
        const accessToken = localStorage.getItem('access-token');
        const refreshToken = localStorage.getItem('refresh-token');
        try {
          const res = await axios.post(
            '/user/reissue',
            {
              accessToken,
              refreshToken,
            },
            {
              headers: {
                Authorization: '',
              },
            },
          );
          localStorage.setItem('access-token', res.data.accessToken);
          localStorage.setItem('refresh-token', res.data.refreshToken);
          axios.defaults.headers.common.Authorization = `Bearer ${res.data.accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return axios(originalRequest);
        } catch (err: any) {
          console.log('error', err);
          if (err.response.status === 404) {
            if (err.response.data.code === 'ADMIN_404_2') {
              localStorage.removeItem('access-token');
              localStorage.removeItem('refresh-token');
              window.location.reload();
            }
          } else if (err.response.status === 500) {
            localStorage.removeItem('access-token');
            localStorage.removeItem('refresh-token');
            window.location.reload();
          }
        }
      }
    }
    return Promise.reject(error);
  },
);

export default axios;
