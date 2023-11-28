import styled from 'styled-components';
import TD from '../TD';
import ActionButton from '../ActionButton';
import parsePhoneNum from '../../../libs/parsePhoneNum';

interface TableBodyProps {
  users: any[];
}

const TableBody = ({ users }: TableBodyProps) => {
  return (
    <tbody>
      {users.map((user) => (
        <tr>
          <TD>{user.name}</TD>
          <TD>{user.email}</TD>
          <TD>{parsePhoneNum(user.phoneNum, true)}</TD>
          <TD></TD>
          <TD>{user.signedUpAt}</TD>
          <TD></TD>
          <TD>
            <ActionButtonGroup>
              <ActionButton to="/admin/users/1/memo" bgColor="blue">
                메모
              </ActionButton>
              <ActionButton to={`/admin/users/${user.id}`} bgColor="lightBlue">
                상세
              </ActionButton>
              <ActionButton to={`/admin/users/${user.id}/edit`} bgColor="green">
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
