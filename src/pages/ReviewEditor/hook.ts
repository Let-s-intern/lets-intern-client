import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import { typeToText } from '../../libs/converToTypeText';

const useReviewEditor = () => {
  const params = useParams();
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProgram = () => {
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
        console.log(res);
        setProgram({
          ...res.data.programDetailVo,
          type: typeToText[res.data.type],
        });
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProgram();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return { loading, error, program };
};

export default useReviewEditor;
