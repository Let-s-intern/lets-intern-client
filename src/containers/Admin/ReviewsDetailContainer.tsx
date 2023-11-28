import { useEffect, useState } from 'react';

import ReviewsDetail from '../../components/Admin/Review/ReviewsDetail';
import axios from '../../libs/axios';
import { useParams } from 'react-router-dom';

const ReviewsDetailContainer = () => {
  const params = useParams();
  const [reviewList, setReviewList] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`/review/${params.programId}`);
        setReviewList(res.data.reviewList);
        console.log(res.data.reviewList);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleVisibleChanged = async (reviewId: number, status: string) => {
    try {
      await axios.patch(`/review/${reviewId}`, { status });
      const newReviewList = reviewList.map((review: any) => {
        if (review.id === reviewId) {
          return {
            ...review,
            status,
          };
        }
        return review;
      });
      setReviewList(newReviewList);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ReviewsDetail
      loading={loading}
      error={error}
      reviewList={reviewList}
      handleVisibleChanged={handleVisibleChanged}
    />
  );
};

export default ReviewsDetailContainer;
