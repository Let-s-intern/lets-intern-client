import styled from 'styled-components';
import TD from '../TD';
import ActionButton from '../ActionButton';

const ActionButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
`;

const TableBody = () => {
  return (
    <tbody>
      <TD>홍민서</TD>
      <TD>mshong1007@gmail.com</TD>
      <TD>010-3449-6933</TD>
      <TD>챌린지 1기</TD>
      <TD>2023-01-01</TD>
      <TD>송다예</TD>
      <TD>
        <ActionButtonGroup>
          <ActionButton to="/admin/users/1/memo" bgColor="blue">
            메모
          </ActionButton>
          <ActionButton to="/admin/users/1" bgColor="lightBlue">
            상세
          </ActionButton>
          <ActionButton bgColor="green">수정</ActionButton>
          <ActionButton bgColor="red">삭제</ActionButton>
        </ActionButtonGroup>
      </TD>
    </tbody>
  );
};

export default TableBody;
