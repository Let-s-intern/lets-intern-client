import styled from 'styled-components';

import TableHead from './TableHead';
import TableBody from './TableBody';
import Table from '../Table';

interface ReviewsProps {
  programList: any;
  copyReviewCreateLink: any;
}

const Reviews = ({ programList, copyReviewCreateLink }: ReviewsProps) => {
  return (
    <>
      <Header>
        <Heading>후기 관리</Heading>
      </Header>
      <Table>
        <TableHead />
        <TableBody
          programList={programList}
          copyReviewCreateLink={copyReviewCreateLink}
        />
      </Table>
    </>
  );
};

export default Reviews;

const Header = styled.header`
  margin-bottom: 1rem;
`;

const Heading = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
`;
