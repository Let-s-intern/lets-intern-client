import dayjs from 'dayjs';

import { IUser } from '../../../../../interfaces/User.interface';
import { convertTypeToBank } from '../../../../../utils/convertTypeToBank';
import ActionButton from '../../../ui/button/ActionButton';
import TD from '../../../ui/table/regacy/TD';

interface TableBodyProps {
  userList: IUser[];
}

const TableBody = ({ userList }: TableBodyProps) => {
  return (
    <tbody>
      {userList.map((user) => (
        <tr key={user.id}>
          <TD>{user.name}</TD>
          <TD>{user.email}</TD>
          <TD>{`${user.contactEmail ? user.contactEmail : '-'}`}</TD>
          <TD>{user.phoneNum}</TD>
          {/* <TD>참여 프로그램 없음</TD> */}
          <TD>{dayjs(user.createdDate).format('YYYY-MM-DD (dd)')}</TD>
          <TD>{convertTypeToBank(user.accountType) || '없음'}</TD>
          <TD>{user.accountNum || '없음'}</TD>
          <TD>{user.marketingAgree ? 'O' : 'X'}</TD>
          <TD>
            <div className="flex justify-center gap-2">
              <ActionButton to={`/admin/users/${user.id}`} bgColor="lightBlue">
                상세
              </ActionButton>
              <ActionButton to={`/admin/users/${user.id}/edit`} bgColor="green">
                수정
              </ActionButton>
              <ActionButton bgColor="red">삭제</ActionButton>
            </div>
          </TD>
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
