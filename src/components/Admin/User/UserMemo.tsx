import ListHeader from '../ListHeader';
import Table from '../Table';
import MemoTableBody from './MemoTableBody';
import MemoTableHead from './MemoTableHead';

const UserMemo = () => {
  return (
    <>
      <ListHeader>메모 - 홍민서</ListHeader>
      <Table>
        <MemoTableHead />
        <MemoTableBody />
      </Table>
    </>
  );
};

export default UserMemo;
