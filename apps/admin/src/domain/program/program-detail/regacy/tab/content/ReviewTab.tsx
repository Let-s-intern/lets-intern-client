import { useEffect } from 'react';
import styled from 'styled-components';

import Star from '../../../../../review/regacy/ui/Star';

interface ReviewTabProps {
  reviewList: any;
}

const ReviewTab = ({ reviewList }: ReviewTabProps) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <ReviewTabBlock>
      {reviewList.length === 0 ? (
        <Placeholder>리뷰가 없습니다.</Placeholder>
      ) : (
        <ReviewList>
          {reviewList.map((review: any) => (
            <ReviewCard key={review.id}>
              <ReviewTop>
                <ReviewUser>
                  {review.username ? review.username : '익명'}
                </ReviewUser>
                <ReviewDate>{review.createdAt}</ReviewDate>
              </ReviewTop>
              <ReviewContent>{review.reviewContents}</ReviewContent>
              <StarArea>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} isActive={review.grade > i} size="1rem" />
                ))}
              </StarArea>
            </ReviewCard>
          ))}
        </ReviewList>
      )}
    </ReviewTabBlock>
  );
};

export default ReviewTab;

const ReviewTabBlock = styled.div`
  padding-top: 0.5rem;
`;

const Placeholder = styled.div`
  text-align: center;
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ReviewCard = styled.div`
  background-color: #f1f4f9;
  padding: 1.5rem 2rem;
  border-radius: 12px;
`;

const ReviewTop = styled.div`
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
`;

const StarArea = styled.div`
  margin-top: 0.75rem;
  display: flex;
  gap: 0.125rem;
`;

const ReviewContent = styled.p`
  margin-top: 0.25rem;
`;

const ReviewUser = styled.span`
  color: #6963f6;
  font-weight: 500;
`;

const ReviewDate = styled.span`
  color: #a1a1aa;
`;
