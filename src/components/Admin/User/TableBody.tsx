import styled from 'styled-components';
import TD from '../TD';
import ActionButton from '../ActionButton';

interface TableBodyProps {
  users: any[];
}

const TableBody = ({ users }: TableBodyProps) => {
  return (
    <tbody>
      {users.map((users) => (
        <tr>
          <TD>{users.name}</TD>
          <TD>{users.email}</TD>
          <TD>{users.phoneNum}</TD>
          <TD>챌린지 1기</TD>
          <TD>{users.signedUpAt}</TD>
          <TD>송다예</TD>
          <TD>
            <ActionButtonGroup>
              <ActionButton to="/admin/users/1/memo" bgColor="blue">
                메모
              </ActionButton>
              <ActionButton to="/admin/users/1" bgColor="lightBlue">
                상세
              </ActionButton>
              <ActionButton to="/admin/users/1/edit" bgColor="green">
                수정
              </ActionButton>
              <ActionButton bgColor="red">삭제</ActionButton>
            </ActionButtonGroup>
          </TD>
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;

const ActionButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
`;
