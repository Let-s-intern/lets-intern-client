import dayjs from 'dayjs';

import { UserAdmin } from '../../../../../schema';
import ActionButton from '../../../ui/button/ActionButton';
import TD from '../../../ui/table/regacy/TD';

interface TableBodyProps {
  userList: UserAdmin;
  handleDeleteUser: (phoneNum: string) => void;
}

const TableBody = ({ userList, handleDeleteUser }: TableBodyProps) => {
  console.log('userList', userList);
  return (
    <tbody>
      {userList.map((user) => (
        <tr key={user.id}>
          <TD>{user.name}</TD>
          <TD>{user.email}</TD>
          <TD>{`${user.contactEmail ? user.contactEmail : '-'}`}</TD>
          <TD>{user.phoneNum}</TD>
          <TD>{dayjs(user.createdDate).format('YYYY-MM-DD (dd)')}</TD>
          <TD>보기</TD>
          <TD>{user.marketingAgree ? 'O' : 'X'}</TD>
          <TD>
            <div className="flex justify-center gap-2">
              <ActionButton to={`/admin/users/${user.id}`} bgColor="lightBlue">
                상세
              </ActionButton>
              <ActionButton to={`/admin/users/${user.id}/edit`} bgColor="green">
                수정
              </ActionButton>
              <ActionButton
                bgColor="red"
                onClick={() => {
                  handleDeleteUser(user.phoneNum);
                }}
              >
                삭제
              </ActionButton>
            </div>
          </TD>
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
