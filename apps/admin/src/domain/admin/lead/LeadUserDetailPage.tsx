import {
  MagnetApplicationByMagnet,
  useMagnetApplicationByMagnetIdQuery,
} from '@/api/leadManagement';
import { formatDateTimeCellValue } from '@/domain/admin/ui/table/TableFilter';
import dayjs from '@/lib/dayjs';
import { Button } from '@mui/material';
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { downloadCsv } from './utils/csv';

// --- Helpers ---

const formatQuestions = (
  questions: MagnetApplicationByMagnet['questionAnswerList'],
) =>
  questions.length
    ? questions.map((q) => `${q.question}: ${q.answer}`).join(' / ')
    : '-';

// --- Main Page ---

const LeadUserDetailPage = () => {
  const params = useParams<{ id: string }>();
  const magnetId = Number(params.id);
  const apiRef = useGridApiRef();

  const { data: applications = [], isLoading } =
    useMagnetApplicationByMagnetIdQuery(magnetId, {
      enabled: !isNaN(magnetId),
    });

  const columns = useMemo<GridColDef<MagnetApplicationByMagnet>[]>(
    () => [
      {
        field: 'createDate',
        headerName: '신청일자',
        type: 'dateTime',
        width: 150,
        valueGetter: (_, row) =>
          row.createDate ? dayjs(row.createDate).toDate() : null,
        valueFormatter: (value) =>
          formatDateTimeCellValue(value, 'YYYY-MM-DD HH:mm'),
      },
      {
        field: 'name',
        headerName: '이름',
        width: 100,
        valueGetter: (_, row) => row.name ?? '-',
      },
      {
        field: 'phoneNum',
        headerName: '전화번호',
        width: 130,
        valueGetter: (_, row) => row.phoneNum ?? '-',
      },
      {
        field: 'grade',
        headerName: '학년',
        width: 80,
        valueGetter: (_, row) => row.grade ?? '-',
      },
      {
        field: 'wishField',
        headerName: '희망 직군',
        width: 110,
        valueGetter: (_, row) => row.wishField ?? '-',
      },
      {
        field: 'wishJob',
        headerName: '희망 직무',
        width: 110,
        valueGetter: (_, row) => row.wishJob ?? '-',
      },
      {
        field: 'wishIndustry',
        headerName: '희망 산업',
        width: 110,
        valueGetter: (_, row) => row.wishIndustry ?? '-',
      },
      {
        field: 'wishCompany',
        headerName: '희망 기업',
        width: 110,
        valueGetter: (_, row) => row.wishCompany ?? '-',
      },
      {
        field: 'questionAnswerList',
        headerName: '질문 답변',
        flex: 1,
        minWidth: 200,
        valueGetter: (_, row) => formatQuestions(row.questionAnswerList),
      },
      {
        field: 'marketingAgree',
        headerName: '마케팅 동의 여부',
        type: 'boolean',
        width: 130,
      },
    ],
    [],
  );

  const handleDownloadCsv = () => {
    // DataGrid의 정렬·필터가 적용된 순서대로 행을 수집한다.
    const sortedRowIds = apiRef.current?.getSortedRowIds() ?? [];
    const sortedRows = sortedRowIds
      .map((id) => apiRef.current?.getRow<MagnetApplicationByMagnet>(id))
      .filter((row): row is MagnetApplicationByMagnet => row != null);

    if (!sortedRows.length) {
      window.alert('다운로드할 데이터가 없습니다.');
      return;
    }

    downloadCsv(
      `magnet-${magnetId}-applications`,
      [
        '신청일자',
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
      sortedRows.map((row) => [
        formatDateTimeCellValue(
          row.createDate ? dayjs(row.createDate).toDate() : null,
          'YYYY-MM-DD HH:mm',
        ),
        row.name ?? '-',
        row.phoneNum ?? '-',
        row.grade ?? '-',
        row.wishField ?? '-',
        row.wishJob ?? '-',
        row.wishIndustry ?? '-',
        row.wishCompany ?? '-',
        formatQuestions(row.questionAnswerList),
        row.marketingAgree ? '동의' : '미동의',
      ]),
    );
  };

  return (
    <div className="px-12 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">마그넷 신청자 목록</h2>
        <Button
          variant="outlined"
          onClick={handleDownloadCsv}
          disabled={!applications.length}
        >
          CSV 내보내기
        </Button>
      </div>
      <DataGrid
        autoHeight
        apiRef={apiRef}
        rows={applications}
        columns={columns}
        getRowId={(row) => row.magnetApplicationId}
        loading={isLoading}
        hideFooter
        getRowHeight={() => 'auto'}
        initialState={{
          sorting: {
            sortModel: [{ field: 'createDate', sort: 'desc' }],
          },
        }}
        sx={{
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
            py: 1,
            whiteSpace: 'normal',
            wordBreak: 'break-word',
          },
        }}
      />
    </div>
  );
};

export default LeadUserDetailPage;
