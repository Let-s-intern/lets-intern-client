import { UserAdmin } from '@/api/userSchema';
import { useState } from 'react';
import ActionButton from '../../../ui/button/ActionButton';
import TD from '../../../ui/table/regacy/TD';

interface TableBodyProps {
  userList: UserAdmin;
}
const DocumentLink = ({
  documentInfos,
  type,
}: {
  documentInfos?: Array<{
    userDocumentType: string;
    fileUrl: string;
    fileName: string;
  }>;
  type: string;
}) => {
  const doc = documentInfos?.find((doc) => doc.userDocumentType === type);

  if (!doc) return <>-</>;

  return (
    <a
      href={doc.fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        textDecoration: 'underline',
        cursor: 'pointer',
      }}
    >
      {doc.fileName.split('/').pop()}
    </a>
  );
};

const TableBody = ({ userList }: TableBodyProps) => {
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
          <TD>{user.userInfo.careerType === 'QUALIFIED' ? '인재' : '없음'}</TD>
          <TD>{user.userInfo.name}</TD>
          <TD>{user.userInfo.phoneNum}</TD>
          <TD>{user.userInfo.email}</TD>
          <TD>{user.userInfo.university}</TD>
          <TD>{user.userInfo.wishField}</TD>
          <TD>{user.userInfo.wishIndustry}</TD>
          <TD>{user.userInfo.wishEmploymentType}</TD>
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
          <TD>주요 경험</TD>
          <TD>주요 경력</TD>
          <TD>
            <DocumentLink documentInfos={user.documentInfos} type="RESUME" />
          </TD>
          <TD>
            <DocumentLink documentInfos={user.documentInfos} type="PORTFOLIO" />
          </TD>
          <TD>
            <DocumentLink
              documentInfos={user.documentInfos}
              type="PERSONAL_STATEMENT"
            />
          </TD>
          <TD>{user.userInfo.memo}</TD>
          <TD>
            <div className="flex justify-center gap-2">
              <ActionButton
                to={`/admin/users/${user.userInfo.id}`}
                bgColor="lightBlue"
              >
                상세
              </ActionButton>
            </div>
          </TD>
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
