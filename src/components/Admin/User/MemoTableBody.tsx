import styled from 'styled-components';

import ActionButton from '../ActionButton';
import TD from '../TD';
import UserMemoModal from './UserMemoModal';

const ActionButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
`;

interface MemoTableBodyProps {
  isModalOpen: boolean;
  handleModalOpen: () => void;
  handleModalClose: () => void;
}

const MemoTableBody = ({
  isModalOpen,
  handleModalOpen,
  handleModalClose,
}: MemoTableBodyProps) => {
  return (
    <>
      <tbody>
        <tr>
          <TD>홍민서</TD>
          <TD>배고파요 배고파요 배고파요 배고파요 배고파요 배고파요</TD>
          <TD>2023-05-05</TD>
          <TD>
            <ActionButtonGroup>
              <ActionButton bgColor="green" onClick={handleModalOpen}>
                수정
              </ActionButton>
              <ActionButton bgColor="red">삭제</ActionButton>
            </ActionButtonGroup>
          </TD>
        </tr>
      </tbody>
      <UserMemoModal isModalOpen={isModalOpen} onClose={handleModalClose} />
    </>
  );
};

export default MemoTableBody;
