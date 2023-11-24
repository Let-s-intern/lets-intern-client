import Table from '../Table';
import ListHeader from '../ListHeader';
import DetailTableHead from './DetailTableHead';
import DetailTableBody from './DetailTableBody';

const ReviewsDetail = () => {
  return (
    <>
      <ListHeader>챌린지 1기 후기 상세</ListHeader>
      <Table>
        <DetailTableHead />
        <DetailTableBody />
      </Table>
    </>
  );
};

export default ReviewsDetail;
