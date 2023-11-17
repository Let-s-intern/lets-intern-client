import { useEffect, useState } from 'react';
import axios from 'axios';

const useAxios = (method: string, path: string, parameter: object) => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);

  const SERVER_API = process.env.REACT_APP_SERVER_API;

  useEffect(() => {
    setLoading(true);
    axios({
      method: method,
      url: `${SERVER_API}${path}`,
      data: parameter,
    })
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
};

export default useAxios;
