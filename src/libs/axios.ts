import Axios from 'axios';

const axios = Axios.create();

axios.defaults.baseURL = `${process.env.REACT_APP_SERVER_API}`;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem(
  'access-token',
)}`;

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
          const res = await axios.post('/user/reissue', {
            accessToken,
            refreshToken,
          });
          localStorage.setItem('access-token', res.data.accessToken);
          localStorage.setItem('refresh-token', res.data.refreshToken);
          axios.defaults.headers.common.Authorization = `Bearer ${res.data.accessToken}`;
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return axios(originalRequest);
        } catch (error) {
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
