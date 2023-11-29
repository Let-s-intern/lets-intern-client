import styled from 'styled-components';

import Table from '../Table';
import MemoTableBody from './MemoTableBody';
import MemoTableHead from './MemoTableHead';
import Heading from '../Heading';
import ActionButton from '../ActionButton';
import UserMemoModal from './UserMemoModal';

interface UserMemoProps {
  loading: boolean;
  error: unknown;
  memoList: any[];
  isModalOpen: boolean;
  handleModalOpen: () => void;
  handleModalClose: () => void;
  handleMemoChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleMemoCreate: (e: any) => void;
}

const UserMemo = (props: UserMemoProps) => {
  if (props.loading) {
    return <div></div>;
  }

  if (props.error) {
    return <div></div>;
  }

  return (
    <>
      <Header>
        <Heading>메모 - 홍민서</Heading>
        <ActionButton onClick={props.handleModalOpen}>등록</ActionButton>
      </Header>
      <Table>
        <MemoTableHead />
        <MemoTableBody
          memoList={props.memoList}
          isModalOpen={props.isModalOpen}
          handleModalOpen={props.handleModalOpen}
          handleModalClose={props.handleModalClose}
        />
      </Table>
      <UserMemoModal
        isModalOpen={props.isModalOpen}
        onClose={props.handleModalClose}
        handleMemoChange={props.handleMemoChange}
        handleMemoCreate={props.handleMemoCreate}
      />
    </>
  );
};

export default UserMemo;

const Header = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
`;
