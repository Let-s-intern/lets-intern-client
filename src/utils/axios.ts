import { createAuthorizedAxios } from './createAuthorizedAxios';

const axios = createAuthorizedAxios({
  baseURL: process.env.NEXT_PUBLIC_SERVER_API!,
});

export default axios;
