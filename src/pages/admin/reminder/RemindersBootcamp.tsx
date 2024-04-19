import { useEffect, useState } from 'react';

import TableTemplate, {
  TableTemplateProps,
} from '../../../components/admin/ui/table/new/TableTemplate';
import TableCell from '../../../components/admin/ui/table/new/TableCell';
import TableRow from '../../../components/admin/ui/table/new/TableRow';

type RemindersBootcampTableKey =
  | 'type'
  | 'programTitle'
  | 'name'
  | 'email'
  | 'phoneNum'
  | 'applyDate';

const RemindersBootcamp = () => {
  const [reminderList, setReminderList] = useState<
    {
      id: number;
      type: string;
      programTitle: string;
      name: string;
      email: string;
      phoneNum: string;
      applyDate: string;
    }[]
  >([]);

  useEffect(() => {
    setReminderList([
      {
        id: 1,
        type: '회원',
        programTitle: '인턴 지원 챌린지 17기',
        name: '임호정',
        email: 'hojeong1234@gmail.com',
        phoneNum: '010-1234-5678',
        applyDate: '2024-03-01',
      },
      {
        id: 2,
        type: '회원',
        programTitle: '인턴 지원 챌린지 17기',
        name: '임호정',
        email: 'hojeong1234@gmail.com',
        phoneNum: '010-1234-5678',
        applyDate: '2024-03-01',
      },
      {
        id: 3,
        type: '회원',
        programTitle: '인턴 지원 챌린지 17기',
        name: '임호정',
        email: 'hojeong1234@gmail.com',
        phoneNum: '010-1234-5678',
        applyDate: '2024-03-01',
      },
    ]);
  }, []);

  const columnMetaData: TableTemplateProps<RemindersBootcampTableKey>['columnMetaData'] =
    {
      type: {
        headLabel: '구분',
        cellWidth: 'w-2/12',
      },
      programTitle: {
        headLabel: '프로그램 제목',
        cellWidth: 'w-2/12',
      },
      name: {
        headLabel: '이름',
        cellWidth: 'w-2/12',
      },
      email: {
        headLabel: '이메일',
        cellWidth: 'w-2/12',
      },
      phoneNum: {
        headLabel: '전화번호',
        cellWidth: 'w-2/12',
      },
      applyDate: {
        headLabel: '신청 날짜',
        cellWidth: 'w-2/12',
      },
    };

  const formatDateString = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  };

  return (
    <TableTemplate<RemindersBootcampTableKey>
      title="사전알림신청 - 부트캠프"
      headerButton={{
        label: '명단 다운로드',
        href: '#',
      }}
      columnMetaData={columnMetaData}
      minWidth="60rem"
    >
      {reminderList.map((reminder) => (
        <TableRow key={reminder.id} minWidth="60rem">
          <TableCell cellWidth={columnMetaData.type.cellWidth}>
            {reminder.type}
          </TableCell>
          <TableCell cellWidth={columnMetaData.programTitle.cellWidth}>
            {reminder.programTitle}
          </TableCell>
          <TableCell cellWidth={columnMetaData.name.cellWidth}>
            {reminder.name}
          </TableCell>
          <TableCell cellWidth={columnMetaData.email.cellWidth}>
            {reminder.email}
          </TableCell>
          <TableCell cellWidth={columnMetaData.phoneNum.cellWidth}>
            {reminder.phoneNum}
          </TableCell>
          <TableCell cellWidth={columnMetaData.applyDate.cellWidth}>
            {formatDateString(reminder.applyDate)}
          </TableCell>
        </TableRow>
      ))}
    </TableTemplate>
  );
};

export default RemindersBootcamp;
