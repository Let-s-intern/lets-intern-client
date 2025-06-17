import { UserAdmin } from '@/api/userSchema';
import dayjs from '@/lib/dayjs';
import { useState } from 'react';
import ActionButton from '../../../ui/button/ActionButton';
import TD from '../../../ui/table/regacy/TD';

interface TableBodyProps {
  userList: UserAdmin;
  handleDeleteUser: (phoneNum: string) => void;
}

const TableBody = ({ userList, handleDeleteUser }: TableBodyProps) => {
  const [hoveredUserId, setHoveredUserId] = useState<number | null>(null);

  const handleMouseEnter = (userId: number) => {
    setHoveredUserId(userId);
  };

  const handleMouseLeave = () => {
    setHoveredUserId(null);
  };

  return (
    <tbody>
      {userList.map((user) => (
        <tr key={user.userInfo.id}>
          <TD>{user.userInfo.name}</TD>
          <TD>{user.userInfo.email}</TD>
          <TD>{`${user.userInfo.contactEmail ? user.userInfo.contactEmail : '-'}`}</TD>
          <TD>{user.userInfo.phoneNum}</TD>
          <TD>{dayjs(user.userInfo.createdDate).format('YYYY-MM-DD (dd)')}</TD>
          <TD>
            <div
              className="relative flex cursor-default items-center justify-center rounded-xl bg-neutral-80 px-2 py-1"
              onMouseEnter={() => handleMouseEnter(user.userInfo.id)}
              onMouseLeave={handleMouseLeave}
            >
              보기
              <div
                className={`absolute top-8 z-10 flex max-h-24 overflow-y-auto ${hoveredUserId === user.userInfo.id ? 'block' : 'hidden'} flex-col items-center justify-start gap-y-1 rounded-xl bg-neutral-70 p-4`}
              >
                {user.applicationInfos.length < 1 ? (
                  <div>신청 내역이 없습니다.</div>
                ) : (
                  user.applicationInfos.map((applicationInfo, idx) => (
                    <div
                      key={`${user.userInfo.id}-${applicationInfo.programId}-${idx}`}
                    >
                      {applicationInfo.programTitle}
                    </div>
                  ))
                )}
              </div>
            </div>
          </TD>
          <TD>{user.userInfo.marketingAgree ? 'O' : 'X'}</TD>
          <TD>
            <div className="flex justify-center gap-2">
              <ActionButton
                to={`/admin/users/${user.userInfo.id}`}
                bgColor="lightBlue"
              >
                상세
              </ActionButton>
              <ActionButton
                to={`/admin/users/${user.userInfo.id}/edit`}
                bgColor="green"
              >
                수정
              </ActionButton>
              <ActionButton
                bgColor="red"
                onClick={() => {
                  handleDeleteUser(user.userInfo.phoneNum);
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
