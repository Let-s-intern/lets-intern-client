import Table from '../Table';
import DetailTableHead from './DetailTableHead';
import DetailTableBody from './DetailTableBody';
import Heading from '../Heading';
import styled from 'styled-components';

interface ReviewsDetailProps {
  loading: boolean;
  error: unknown;
  reviewList: any;
  handleVisibleChanged: (reviewId: number, status: string) => void;
}

const ReviewsDetail = ({
  loading,
  error,
  reviewList,
  handleVisibleChanged,
}: ReviewsDetailProps) => {
  if (loading) {
    return <></>;
  }

  if (error) {
    return <>에러 발생</>;
  }

  return (
    <>
      <Header>
        <Heading>챌린지 1기 후기 상세</Heading>
      </Header>
      <Table>
        <DetailTableHead />
        <DetailTableBody
          reviewList={reviewList}
          handleVisibleChanged={handleVisibleChanged}
        />
      </Table>
    </>
  );
};

export default ReviewsDetail;

const Header = styled.header`
  margin-bottom: 1rem;
`;
