import { useEffect, useState } from 'react';

import axios from '../../../utils/axios';
import CardListSlider from '../../CardListSlider';
import ReviewCard from '../../../components/common/card/ReviewCard';

const Review = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown>(null);
  const [waitingReviewList, setWaitingReviewList] = useState([]);
  const [myReviewList, setMyReviewList] = useState([]);

  const statusToLabel = {
    WAITING: { label: '대기중', bgColor: '#4743A8', color: '#FFFFFF' },
    DONE: { label: '작성완료', bgColor: '#6963F6', color: '#FFFFFF' },
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const {
          data: { userApplicationList: applicationList },
        } = await axios.get('/application');
        setWaitingReviewList(
          applicationList.filter(
            (application: any) =>
              (application.status === 'DONE' ||
                application.status === 'IN_PROGRESS') &&
              application.reviewId === null,
          ),
        );
        setMyReviewList(
          applicationList.filter(
            (application: any) =>
              (application.status === 'DONE' ||
                application.status === 'IN_PROGRESS') &&
              application.reviewId !== null,
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

  if (error) {
    return <main>에러 발생</main>;
  }

  return (
    <main className="mypage-content">
      <section>
        <h1>후기를 기다리고 있어요</h1>
        {loading ? (
          <CardListSlider isEmpty={true}>
            <div className="card-list-placeholder" />
          </CardListSlider>
        ) : !waitingReviewList || waitingReviewList.length === 0 ? (
          <CardListSlider isEmpty={true}>
            <div className="card-list-placeholder">
              작성해야 할 후기가 없습니다.
            </div>
          </CardListSlider>
        ) : (
          <CardListSlider>
            {waitingReviewList.map((application: any) => (
              <ReviewCard
                key={application.id}
                to={`/program/${application.programId}/application/${application.id}/review/create`}
                application={application}
                status="WAITING"
                statusToLabel={statusToLabel}
                bottomText="후기 작성하기"
              />
            ))}
          </CardListSlider>
        )}
      </section>
      <section>
        <h1>작성한 후기 확인하기</h1>
        {loading ? (
          <CardListSlider isEmpty={true}>
            <div className="card-list-placeholder" />
          </CardListSlider>
        ) : !myReviewList || myReviewList.length === 0 ? (
          <CardListSlider isEmpty={true}>
            <div className="card-list-placeholder">작성한 후기가 없습니다.</div>
          </CardListSlider>
        ) : (
          myReviewList.map((application: any) => (
            <CardListSlider>
              <ReviewCard
                key={application.id}
                to={`/program/${application.id}/review/${application.reviewId}`}
                application={application}
                status="DONE"
                statusToLabel={statusToLabel}
                bottomText="후기 확인하기"
              />
            </CardListSlider>
          ))
        )}
      </section>
    </main>
  );
};

export default Review;
