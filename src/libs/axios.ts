import Axios from 'axios';

const axios = Axios.create();

axios.defaults.baseURL = `${process.env.REACT_APP_SERVER_API}`;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem(
  'access-token',
)}`;

export default axios;
