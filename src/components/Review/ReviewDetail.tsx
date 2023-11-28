import styled from 'styled-components';
import Star from './Star';
import { convertTypeToText } from '../../libs/converTypeToText';

interface ReviewDetailProps {
  loading: boolean;
  error: unknown;
  review: any;
  program: any;
}

const ReviewDetail = ({
  loading,
  error,
  review,
  program,
}: ReviewDetailProps) => {
  if (loading) {
    return <div></div>;
  }

  if (error) {
    return <div>에러 발생</div>;
  }

  return (
    <ReviewDetailBlock>
      <Header>
        <ProgramType>{convertTypeToText(program.type, false)}</ProgramType>
        <ProgramTitle>{program.title}</ProgramTitle>
        <ProgramDate>{program.startDate} ~</ProgramDate>
        <StarRating>
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} isActive={review.grade > i} />
          ))}
        </StarRating>
      </Header>
      <ReviewSection>
        <SectionTitle>후기 내용</SectionTitle>
        <ReviewContent>{review.reviewContents}</ReviewContent>
        <UserArea>
          <UserLabel>작성자</UserLabel>
          <UserName>{review.username ? review.username : '익명'}</UserName>
        </UserArea>
      </ReviewSection>
    </ReviewDetailBlock>
  );
};

export default ReviewDetail;

const ReviewDetailBlock = styled.div`
  width: 100%;
  padding: 0 1.25rem;

  @media (min-width: 768px) {
    max-width: 768px;
    margin: 0 auto;
  }
`;

const Header = styled.header`
  padding: 1rem 0.5rem;
  border-bottom: 1px solid #e9e9e9;
`;

const ProgramType = styled.span`
  display: block;
  font-size: 0.75rem;
  color: #5854d1;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const ProgramTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: #4a495c;
`;

const ProgramDate = styled.p`
  color: #c4c4c4;
  font-size: 0.875rem;
`;

const StarRating = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-top: 0.5rem;
`;

const ReviewSection = styled.section`
  padding: 1rem 0.5rem;
`;

const SectionTitle = styled.h2`
  color: #4a495c;
  font-size: 1.25rem;
  font-weight: 500;
`;

const ReviewContent = styled.p`
  margin-top: 0.5rem;
  color: #7f7f7f;
`;

const UserArea = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
`;

const UserLabel = styled.span`
  color: #4a495c;
  font-weight: 500;
  font-size: 0.875rem;
`;

const UserName = styled.span`
  color: #5854d1;
  font-weight: 500;
  font-size: 0.875rem;
`;
