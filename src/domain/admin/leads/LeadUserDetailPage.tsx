'use client';

import {
  MagnetApplicationByMagnet,
  useMagnetApplicationByMagnetIdQuery,
} from '@/api/leadManagement';
import TableCell from '@/domain/admin/ui/table/new/TableCell';
import TableRow from '@/domain/admin/ui/table/new/TableRow';
import TableTemplate, {
  TableTemplateProps,
} from '@/domain/admin/ui/table/new/TableTemplate';
import { Button } from '@mui/material';
import { useParams } from 'next/navigation';
import { downloadCsv } from './utils/csv';

// --- Table Column Key ---

type ColumnKey =
  | 'name'
  | 'phoneNum'
  | 'grade'
  | 'wishField'
  | 'wishJob'
  | 'wishIndustry'
  | 'wishCompany'
  | 'questionAnswerList'
  | 'marketingAgree';

const columnMetaData: TableTemplateProps<ColumnKey>['columnMetaData'] = {
  name: { headLabel: '이름', cellWidth: 'w-[10%]' },
  phoneNum: { headLabel: '전화번호', cellWidth: 'w-[12%]' },
  grade: { headLabel: '학년', cellWidth: 'w-[8%]' },
  wishField: { headLabel: '희망 직군', cellWidth: 'w-[10%]' },
  wishJob: { headLabel: '희망 직무', cellWidth: 'w-[10%]' },
  wishIndustry: { headLabel: '희망 산업', cellWidth: 'w-[10%]' },
  wishCompany: { headLabel: '희망 기업', cellWidth: 'w-[10%]' },
  questionAnswerList: { headLabel: '질문 답변', cellWidth: 'w-[20%]' },
  marketingAgree: { headLabel: '마케팅 동의 여부', cellWidth: 'w-[10%]' },
};

const MIN_TABLE_WIDTH = '70rem';

const formatQuestions = (
  questions: Array<{ question: string; answer: string }>,
) =>
  questions.length
    ? questions.map((q) => `${q.question}: ${q.answer}`).join(' / ')
    : '-';

// --- Main Page ---

const LeadUserDetailPage = () => {
  const params = useParams<{ id: string }>();
  const magnetId = Number(params.id);

  const { data: applications = [], isLoading } =
    useMagnetApplicationByMagnetIdQuery(magnetId, {
      enabled: !isNaN(magnetId),
    });

  const handleDownloadCsv = () => {
    if (!applications.length) {
      window.alert('다운로드할 데이터가 없습니다.');
      return;
    }

    downloadCsv(
      `magnet-${magnetId}-applications`,
      [
        '이름',
        '전화번호',
        '학년',
        '희망직군',
        '희망직무',
        '희망산업',
        '희망기업',
        '질문 답변',
        '마케팅 동의 여부',
      ],
      applications.map((row) => [
        row.name,
        row.phoneNum,
        row.grade,
        row.wishField,
        row.wishJob,
        row.wishIndustry,
        row.wishCompany,
        formatQuestions(row.questionAnswerList),
        row.marketingAgree ? '동의' : '미동의',
      ]),
    );
  };

  const renderRow = (row: MagnetApplicationByMagnet) => (
    <TableRow key={row.magnetApplicationId} minWidth={MIN_TABLE_WIDTH}>
      <TableCell cellWidth={columnMetaData.name.cellWidth}>
        {row.name || '-'}
      </TableCell>
      <TableCell cellWidth={columnMetaData.phoneNum.cellWidth}>
        {row.phoneNum || '-'}
      </TableCell>
      <TableCell cellWidth={columnMetaData.grade.cellWidth}>
        {row.grade || '-'}
      </TableCell>
      <TableCell cellWidth={columnMetaData.wishField.cellWidth}>
        {row.wishField || '-'}
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
      <TableCell cellWidth={columnMetaData.questionAnswerList.cellWidth}>
        {formatQuestions(row.questionAnswerList)}
      </TableCell>
      <TableCell cellWidth={columnMetaData.marketingAgree.cellWidth}>
        {row.marketingAgree ? '동의' : '미동의'}
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <div className="mt-4 flex justify-end px-12">
        <Button
          variant="outlined"
          onClick={handleDownloadCsv}
          disabled={!applications.length}
        >
          CSV 내보내기
        </Button>
      </div>
      <TableTemplate<ColumnKey>
        title="마그넷 신청자 목록"
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
