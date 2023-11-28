import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ReviewDetail from '../components/Review/ReviewDetail';
import axios from '../libs/axios';

const ReviewDetailContainer = () => {
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [review, setReview] = useState<any>({});
  const [program, setProgram] = useState<any>({});

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await axios.get(`/review/${params.reviewId}`);
        setReview(res.data);
      } catch (error) {
        setError(error);
      }
    };
    const fetchProgram = async () => {
      try {
        const res = await axios.get('/program');
        const foundedProgram = res.data.programList.find(
          (program: any) => program.id === Number(params.programId),
        );
        setProgram(foundedProgram);
      } catch (error) {
        setError(error);
      }
    };
    fetchReview();
    fetchProgram();
    setLoading(false);
  }, []);

  return (
    <ReviewDetail
      loading={loading}
      error={error}
      review={review}
      program={program}
    />
  );
};

export default ReviewDetailContainer;
