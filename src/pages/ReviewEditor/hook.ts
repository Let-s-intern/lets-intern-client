import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { convertToTypeText } from '../../utils/convertToTypeText';

const useReviewEditor = () => {
  const params = useParams();
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!params.programId) return;
    setLoading(true);
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_SERVER_API}/program/${params.programId}`,
      params: {
        isAdmin: true,
      },
    })
      .then((res) => {
        setProgram({ ...res.data, type: convertToTypeText[res.data.type] });
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params]);

  return { loading, error, program };
};

export default useReviewEditor;
