import { useEffect, useState } from 'react';

import ReviewsDetail from '../../components/Admin/Review/ReviewsDetail';
import axios from '../../libs/axios';
import { useLocation, useParams } from 'react-router-dom';

const ReviewsDetailContainer = () => {
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [reviewList, setReviewList] = useState<any>([]);
  const [program, setProgram] = useState<any>({});

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        let res;
        res = await axios.get(`/review/admin/${params.programId}`);
        console.log(res.data.reviewList);
        setReviewList(res.data.reviewList);
        res = await axios.get(`/program/admin`);
        console.log(res.data.programList);
        const foundedProgram = res.data.programList.find(
          (program: any) => program.id === Number(params.programId),
        );
        setProgram(foundedProgram);
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
      program={program}
    />
  );
};

export default ReviewsDetailContainer;
