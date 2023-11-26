import styled from 'styled-components';

import Table from '../Table';
import MemoTableBody from './MemoTableBody';
import MemoTableHead from './MemoTableHead';
import Heading from '../Heading';
import ActionButton from '../ActionButton';
import UserMemoModal from './UserMemoModal';

interface UserMemoProps {
  isModalOpen: boolean;
  handleModalOpen: () => void;
  handleModalClose: () => void;
}

const UserMemo = ({
  isModalOpen,
  handleModalOpen,
  handleModalClose,
}: UserMemoProps) => {
  return (
    <>
      <Header>
        <Heading>메모 - 홍민서</Heading>
        <ActionButton onClick={handleModalOpen}>등록</ActionButton>
      </Header>
      <UserMemoModal isModalOpen={isModalOpen} onClose={handleModalClose} />
      <Table>
        <MemoTableHead />
        <MemoTableBody
          isModalOpen={isModalOpen}
          handleModalOpen={handleModalOpen}
          handleModalClose={handleModalClose}
        />
      </Table>
    </>
  );
};

export default UserMemo;

const Header = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
`;
