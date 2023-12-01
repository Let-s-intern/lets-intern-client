import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import axios from '../libs/axios';
import { typeToText } from '../libs/converTypeToText';
import ReviewEditor from '../components/Review/ReviewEditor';

const ReviewCreateContainer = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [values, setValues] = useState<any>({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('access-token');
      if (!token) {
        setIsLoggedIn(false);
        return;
      }
      try {
        await axios.get('/user');
        setIsLoggedIn(true);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    checkLoggedIn();
  }, []);

  useEffect(() => {
    if (values.grade >= 1 && values.reviewContents) {
      setIsSubmitDisabled(false);
    } else {
      setIsSubmitDisabled(true);
    }
  }, [values]);

  useEffect(() => {
    const fetchProgram = async () => {
      if (!params.programId) return;
      setLoading(true);
      try {
        const res = await axios.get(`/program/${params.programId}`, {
          headers: {
            Authorization: isLoggedIn
              ? `Bearer ${localStorage.getItem('access-token')}`
              : '',
          },
        });
        console.log(res.data.programDetailVo);
        setProgram({
          ...res.data.programDetailVo,
          type: typeToText[res.data.type],
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
  }, [params]);

  const handleRatingChange = (value: number) => {
    setValues({ ...values, grade: value });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmitButton = async () => {
    const reqData = values;
    try {
      if (isLoggedIn && params.applicationId) {
        await axios.post(`/review/${params.applicationId}`, reqData);
        navigate('/mypage/review');
      } else {
        await axios.post(`/review?programId=${params.programId}`, reqData, {
          headers: { Authorization: '' },
        });
        navigate(`/program/${params.programId}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ReviewEditor
      loading={loading}
      error={error}
      program={program}
      values={values}
      isSubmitDisabled={isSubmitDisabled}
      handleRatingChange={handleRatingChange}
      handleInputChange={handleInputChange}
      handleSubmitButton={handleSubmitButton}
    />
  );
};

export default ReviewCreateContainer;
