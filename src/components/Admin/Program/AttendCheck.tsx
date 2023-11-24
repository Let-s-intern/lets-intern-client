import ListHeader from '../ListHeader';
import Table from '../Table';
import AttendTableBody from './AttendTableBody';
import AttendTableHead from './AttendTableHead';

const AttendCheck = () => {
  return (
    <>
      <ListHeader>출석체크 - 챌린지 1기</ListHeader>
      <Table>
        <AttendTableHead />
        <AttendTableBody />
      </Table>
    </>
  );
};

export default AttendCheck;
