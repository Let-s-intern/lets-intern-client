'use client';

import {
  MagnetApplication,
  useLeadManagementUserDetailQuery,
  useMagnetApplicationListQuery,
} from '@/api/leadManagement';
import TableCell from '@/domain/admin/ui/table/new/TableCell';
import TableRow from '@/domain/admin/ui/table/new/TableRow';
import TableTemplate, {
  TableTemplateProps,
} from '@/domain/admin/ui/table/new/TableTemplate';
import dayjs from '@/lib/dayjs';
import { Button } from '@mui/material';
import { useParams } from 'next/navigation';
import { downloadCsv } from './utils/csv';

// --- Table Column Key ---

type ColumnKey =
  | 'applicationDate'
  | 'name'
  | 'phoneNum'
  | 'grade'
  | 'wishJobGroup'
  | 'wishJob'
  | 'wishIndustry'
  | 'wishCompany'
  | 'defaultQuestions'
  | 'selectQuestions'
  | 'marketingAgree';

const columnMetaData: TableTemplateProps<ColumnKey>['columnMetaData'] = {
  applicationDate: { headLabel: '신청일자', cellWidth: 'w-[8%]' },
  name: { headLabel: '이름', cellWidth: 'w-[7%]' },
  phoneNum: { headLabel: '전화번호', cellWidth: 'w-[10%]' },
  grade: { headLabel: '학년', cellWidth: 'w-[5%]' },
  wishJobGroup: { headLabel: '희망 직군', cellWidth: 'w-[8%]' },
  wishJob: { headLabel: '희망 직무', cellWidth: 'w-[8%]' },
  wishIndustry: { headLabel: '희망 산업', cellWidth: 'w-[8%]' },
  wishCompany: { headLabel: '희망 기업', cellWidth: 'w-[8%]' },
  defaultQuestions: { headLabel: '기본 질문', cellWidth: 'w-[14%]' },
  selectQuestions: { headLabel: '선택 질문', cellWidth: 'w-[14%]' },
  marketingAgree: { headLabel: '마케팅 동의 여부', cellWidth: 'w-[10%]' },
};

const MIN_TABLE_WIDTH = '80rem';

const formatQuestions = (
  questions: Array<{ question: string; answer: string }>,
) =>
  questions.length
    ? questions.map((q) => `${q.question}: ${q.answer}`).join(' / ')
    : '-';

// --- Main Page ---

const LeadUserDetailPage = () => {
  const params = useParams<{ id: string }>();
  const userId = Number(params.id);

  const { data: userDetail } = useLeadManagementUserDetailQuery(userId, {
    enabled: !isNaN(userId),
  });

  const { data: applications = [], isLoading } = useMagnetApplicationListQuery(
    userId,
    {
      enabled: !isNaN(userId),
    },
  );

  const userName = userDetail?.name ?? '알 수 없는 사용자';

  const handleDownloadCsv = () => {
    if (!applications.length) {
      window.alert('다운로드할 데이터가 없습니다.');
      return;
    }

    downloadCsv(
      `lead-user-${userId}`,
      [
        '신청일자',
        '이름',
        '전화번호',
        '학년',
        '희망직군',
        '희망직무',
        '희망산업',
        '희망기업',
        '기본 질문',
        '선택 질문',
        '마케팅 동의 여부',
      ],
      applications.map((row) => [
        row.applicationDate
          ? dayjs(row.applicationDate).format('YYYY.MM.DD')
          : '',
        row.name,
        row.phoneNum,
        row.grade,
        row.wishJobGroup,
        row.wishJob,
        row.wishIndustry,
        row.wishCompany,
        formatQuestions(row.defaultQuestions),
        formatQuestions(row.selectQuestions),
        row.marketingAgree ? '동의' : '미동의',
      ]),
    );
  };

  const renderRow = (row: MagnetApplication) => (
    <TableRow key={row.id} minWidth={MIN_TABLE_WIDTH}>
      <TableCell cellWidth={columnMetaData.applicationDate.cellWidth}>
        {row.applicationDate
          ? dayjs(row.applicationDate).format('YYYY.MM.DD')
          : '-'}
      </TableCell>
      <TableCell cellWidth={columnMetaData.name.cellWidth}>
        {row.name || '-'}
      </TableCell>
      <TableCell cellWidth={columnMetaData.phoneNum.cellWidth}>
        {row.phoneNum || '-'}
      </TableCell>
      <TableCell cellWidth={columnMetaData.grade.cellWidth}>
        {row.grade || '-'}
      </TableCell>
      <TableCell cellWidth={columnMetaData.wishJobGroup.cellWidth}>
        {row.wishJobGroup || '-'}
      </TableCell>
      <TableCell cellWidth={columnMetaData.wishJob.cellWidth}>
        {row.wishJob || '-'}
      </TableCell>
      <TableCell cellWidth={columnMetaData.wishIndustry.cellWidth}>
        {row.wishIndustry || '-'}
      </TableCell>
      <TableCell cellWidth={columnMetaData.wishCompany.cellWidth}>
        {row.wishCompany || '-'}
      </TableCell>
      <TableCell cellWidth={columnMetaData.defaultQuestions.cellWidth}>
        {formatQuestions(row.defaultQuestions)}
      </TableCell>
      <TableCell cellWidth={columnMetaData.selectQuestions.cellWidth}>
        {formatQuestions(row.selectQuestions)}
      </TableCell>
      <TableCell cellWidth={columnMetaData.marketingAgree.cellWidth}>
        {row.marketingAgree ? '동의' : '미동의'}
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <div className="flex justify-end px-12">
        <Button
          variant="outlined"
          onClick={handleDownloadCsv}
          disabled={!applications.length}
        >
          CSV 내보내기
        </Button>
      </div>
      <TableTemplate<ColumnKey>
        title={`${userName} 신청자`}
        columnMetaData={columnMetaData}
        minWidth={MIN_TABLE_WIDTH}
      >
        {isLoading ? (
          <div className="py-6 text-center text-gray-500">로딩 중...</div>
        ) : applications.length === 0 ? (
          <div className="py-6 text-center text-gray-500">
            표시할 데이터가 없습니다.
          </div>
        ) : (
          applications.map(renderRow)
        )}
      </TableTemplate>
    </>
  );
};

export default LeadUserDetailPage;
