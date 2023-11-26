import Table from '../Table';
import DetailTableHead from './DetailTableHead';
import DetailTableBody from './DetailTableBody';
import Heading from '../Heading';
import styled from 'styled-components';

const ReviewsDetail = () => {
  return (
    <>
      <Header>
        <Heading>챌린지 1기 후기 상세</Heading>
      </Header>
      <Table>
        <DetailTableHead />
        <DetailTableBody />
      </Table>
    </>
  );
};

export default ReviewsDetail;

const Header = styled.header`
  margin-bottom: 1rem;
`;
