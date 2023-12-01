import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import ReviewDetail from '../components/Review/ReviewDetail';
import axios from '../libs/axios';

const ReviewDetailContainer = () => {
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [review, setReview] = useState<any>({});

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await axios.get(`/review/${params.reviewId}`);
        console.log(res.data);
        setReview(res.data);
      } catch (error) {
        setError(error);
      }
    };
    fetchReview();
    setLoading(false);
  }, []);

  return <ReviewDetail loading={loading} error={error} review={review} />;
};

export default ReviewDetailContainer;
