import { useEffect, useState } from 'react';

import TableTemplate, {
  TableTemplateProps,
} from '../../../components/admin/ui/table/new/TableTemplate';
import TableCell from '../../../components/admin/ui/table/new/TableCell';
import TableRow from '../../../components/admin/ui/table/new/TableRow';

type RemindersLetsChatTableKey =
  | 'type'
  | 'programTitle'
  | 'name'
  | 'email'
  | 'phoneNum'
  | 'wishJob'
  | 'wishIndustry'
  | 'preQuestion'
  | 'applyDate';

const RemindersLetsChat = () => {
  const [reminderList, setReminderList] = useState<
    {
      id: number;
      type: string;
      programTitle: string;
      name: string;
      email: string;
      phoneNum: string;
      wishJob: string;
      wishIndustry: string;
      preQuestion: string;
      applyDate: string;
    }[]
  >([]);

  useEffect(() => {
    setReminderList([
      {
        id: 1,
        type: '회원',
        programTitle: '자기소개서 작성 강의 세션',
        name: '임호정',
        email: 'hojeong1234@gmail.com',
        phoneNum: '010-1234-5678',
        wishJob: '서비스 기획',
        wishIndustry: '자동차 산업',
        preQuestion: '포트폴리오 만드는 게 너무 어려워요.',
        applyDate: '2024-03-01',
      },
      {
        id: 2,
        type: '회원',
        programTitle: '자기소개서 작성 강의 세션',
        name: '임호정',
        email: 'hojeong1234@gmail.com',
        phoneNum: '010-1234-5678',
        wishJob: '서비스 기획',
        wishIndustry: '자동차 산업',
        preQuestion: '포트폴리오 만드는 게 너무 어려워요.',
        applyDate: '2024-03-01',
      },
      {
        id: 3,
        type: '회원',
        programTitle: '자기소개서 작성 강의 세션',
        name: '임호정',
        email: 'hojeong1234@gmail.com',
        phoneNum: '010-1234-5678',
        wishJob: '서비스 기획',
        wishIndustry: '자동차 산업',
        preQuestion: '포트폴리오 만드는 게 너무 어려워요.',
        applyDate: '2024-03-01',
      },
    ]);
  }, []);

  const columnMetaData: TableTemplateProps<RemindersLetsChatTableKey>['columnMetaData'] =
    {
      type: {
        headLabel: '구분',
        cellWidth: 'w-1/12',
      },
      programTitle: {
        headLabel: '프로그램 제목',
        cellWidth: 'w-2/12',
      },
      name: {
        headLabel: '이름',
        cellWidth: 'w-1/12',
      },
      email: {
        headLabel: '이메일',
        cellWidth: 'w-2/12',
      },
      phoneNum: {
        headLabel: '전화번호',
        cellWidth: 'w-1/12',
      },

      wishJob: {
        headLabel: '희망 직무',
        cellWidth: 'w-1/12',
      },
      wishIndustry: {
        headLabel: '희망 산업',
        cellWidth: 'w-1/12',
      },
      preQuestion: {
        headLabel: '사전 질문',
        cellWidth: 'w-2/12',
      },
      applyDate: {
        headLabel: '신청 날짜',
        cellWidth: 'w-1/12',
      },
    };

  const formatDateString = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  };

  return (
    <TableTemplate<RemindersLetsChatTableKey>
      title="사전알림신청 - 렛츠챗"
      headerButton={{
        label: '명단 다운로드',
        href: '#',
      }}
      columnMetaData={columnMetaData}
      minWidth="110rem"
    >
      {reminderList.map((reminder) => (
        <TableRow key={reminder.id} minWidth="110rem">
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
          <TableCell cellWidth={columnMetaData.wishJob.cellWidth}>
            {reminder.wishJob}
          </TableCell>
          <TableCell cellWidth={columnMetaData.wishIndustry.cellWidth}>
            {reminder.wishIndustry}
          </TableCell>
          <TableCell cellWidth={columnMetaData.preQuestion.cellWidth}>
            {reminder.preQuestion}
          </TableCell>
          <TableCell cellWidth={columnMetaData.applyDate.cellWidth}>
            {formatDateString(reminder.applyDate)}
          </TableCell>
        </TableRow>
      ))}
    </TableTemplate>
  );
};

export default RemindersLetsChat;
