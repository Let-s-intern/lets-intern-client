import styled from 'styled-components';

import ActionButton from '../../../ui/button/ActionButton';
import TD from '../../../ui/table/regacy/TD';

interface MemoTableBodyProps {
  memoList: any[];
  isModalOpen: boolean;
  handleModalOpen: () => void;
  handleModalClose: () => void;
  onModalEditOpen: (memoId: number) => void;
  onDeleteMemo: (memoId: number) => void;
}

const MemoTableBody = (props: MemoTableBodyProps) => {
  return (
    <>
      <tbody>
        {props.memoList.map((memo: any) => (
          <tr key={memo.id}>
            <TD>{memo.creator}</TD>
            <TD>{memo.contents}</TD>
            <TD>{memo.createdAt}</TD>
            <TD>
              <ActionButtonGroup>
                <ActionButton
                  bgColor="green"
                  onClick={() => props.onModalEditOpen(memo.id)}
                >
                  수정
                </ActionButton>
                <ActionButton
                  bgColor="red"
                  onClick={() => props.onDeleteMemo(memo.id)}
                >
                  삭제
                </ActionButton>
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
