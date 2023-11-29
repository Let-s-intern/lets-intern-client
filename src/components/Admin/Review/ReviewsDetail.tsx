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
  program: any;
}

const ReviewsDetail = ({
  loading,
  error,
  reviewList,
  handleVisibleChanged,
  program,
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
        <Heading>후기 목록 - {program.title}</Heading>
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
