import styled from 'styled-components';

interface ReviewTabProps {
  reviewList: any;
}

const ReviewTab = ({ reviewList }: ReviewTabProps) => {
  return reviewList.length === 0 ? (
    <Placeholder>리뷰가 없습니다.</Placeholder>
  ) : (
    reviewList.map((review: any) => (
      <ReviewList>
        <ReviewCard>
          <ReviewTop>
            <ReviewUser>
              {review.username ? review.username : '익명'}&nbsp;({review.grade}
              학년)
            </ReviewUser>
            <ReviewDate>{review.createdAt}</ReviewDate>
          </ReviewTop>
          <ReviewContent>{review.reviewContents}</ReviewContent>
        </ReviewCard>
      </ReviewList>
    ))
  );
};

export default ReviewTab;

const Placeholder = styled.div`
  text-align: center;
`;

const ReviewList = styled.div``;

const ReviewCard = styled.div`
  background-color: #f1f4f9;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ReviewTop = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.75rem;
`;

const ReviewContent = styled.p``;

const ReviewUser = styled.span`
  color: #6963f6;
  font-weight: 500;
`;

const ReviewDate = styled.span`
  color: #a1a1aa;
`;
