import { useEffect, useRef, useState } from 'react';

import Review from '../components/MyPage/Review/Review';
import axios from '../libs/axios';

const ReviewContainer = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [waitingReviewList, setWaitingReviewList] = useState([]);
  const [myReviewList, setMyReviewList] = useState([]);

  const statusToLabel = useRef<any>({
    WAITING: { label: '대기중', bgColor: '#4743A8', color: '#FFFFFF' },
    DONE: { label: '작성완료', bgColor: '#6963F6', color: '#FFFFFF' },
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const {
          data: { userApplicationList: applicationList },
        } = await axios.get('/application');
        setWaitingReviewList(
          applicationList.filter(
            (application: any) =>
              // application.status === 'DONE' && !application.review,
              !application.review,
          ),
        );
        setMyReviewList(
          applicationList.filter(
            (application: any) =>
              // application.status === 'DONE' && application.review,
              application.review,
          ),
        );
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <Review
      loading={loading}
      error={error}
      waitingReviewList={waitingReviewList}
      myReviewList={myReviewList}
      statusToLabel={statusToLabel.current}
    />
  );
};

export default ReviewContainer;
