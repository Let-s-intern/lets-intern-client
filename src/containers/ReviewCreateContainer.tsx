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
        const res = await axios.get(`/program/${params.programId}`);
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
      const res = await axios.post(`/review/${params.programId}`, reqData, {
        headers: {
          Authorization: isLoggedIn
            ? `Bearer ${localStorage.getItem('access-token')}`
            : '',
        },
      });
      console.log(res);
      navigate('/mypage/review');
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
