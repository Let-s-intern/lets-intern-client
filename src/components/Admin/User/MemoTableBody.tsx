import styled from 'styled-components';

import ActionButton from '../ActionButton';
import TD from '../TD';
import UserMemoModal from './UserMemoModal';

interface MemoTableBodyProps {
  memoList: any[];
  isModalOpen: boolean;
  handleModalOpen: () => void;
  handleModalClose: () => void;
}

const MemoTableBody = (props: MemoTableBodyProps) => {
  return (
    <>
      <tbody>
        {props.memoList.map((memo: any) => (
          <tr>
            <TD>{memo.creator}</TD>
            <TD>{memo.contents}</TD>
            <TD>{memo.createdAt}</TD>
            <TD>
              <ActionButtonGroup>
                <ActionButton bgColor="green" onClick={props.handleModalOpen}>
                  수정
                </ActionButton>
                <ActionButton bgColor="red">삭제</ActionButton>
              </ActionButtonGroup>
            </TD>
          </tr>
        ))}
      </tbody>
    </>
  );
};

export default MemoTableBody;

const ActionButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
`;
