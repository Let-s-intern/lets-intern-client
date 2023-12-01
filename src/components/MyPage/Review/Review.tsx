import styled from 'styled-components';

import CardListSlider from '../CardListSlider';
import { Section, SectionTitle } from '../Section';
import ReviewCard from './ReviewCard';
import Placeholder from '../Placeholder';

interface ReviewProps {
  loading: boolean;
  error: unknown;
  waitingReviewList: any;
  myReviewList: any;
  statusToLabel: any;
}

const Review = ({
  loading,
  error,
  waitingReviewList,
  myReviewList,
  statusToLabel,
}: ReviewProps) => {
  if (loading) {
    return <ReviewBlock>로딩중...</ReviewBlock>;
  }

  if (error) {
    return <ReviewBlock>에러 발생</ReviewBlock>;
  }

  return (
    <ReviewBlock>
      <Section>
        <SectionTitle>후기를 기다리고 있어요</SectionTitle>
        <CardListSlider>
          {!waitingReviewList || waitingReviewList.length === 0 ? (
            <Placeholder>작성해야 할 후기가 없습니다.</Placeholder>
          ) : (
            waitingReviewList.map((application: any) => (
              <ReviewCard
                key={application.id}
                to={`/program/${application.programId}/application/${application.id}/review/create`}
                application={application}
                status="WAITING"
                statusToLabel={statusToLabel}
                bottomText="후기 작성하기"
              />
            ))
          )}
        </CardListSlider>
      </Section>
      <Section>
        <SectionTitle>작성한 후기 확인하기</SectionTitle>
        <CardListSlider>
          {!myReviewList || myReviewList.length === 0 ? (
            <Placeholder>작성한 후기가 없습니다.</Placeholder>
          ) : (
            myReviewList.map((application: any) => (
              <ReviewCard
                key={application.id}
                to={`/program/${application.id}/review/${application.reviewId}`}
                application={application}
                status="DONE"
                statusToLabel={statusToLabel}
                bottomText="후기 확인하기"
              />
            ))
          )}
        </CardListSlider>
      </Section>
    </ReviewBlock>
  );
};

export default Review;

const ReviewBlock = styled.div``;
