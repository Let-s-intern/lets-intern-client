import { useChallengeMissionFeedbackQuery } from '@/api/challenge';
import { LOCALIZED_YYYY_MD_Hm } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

interface Row {
  id: number | string;
  title: string;
  th: number; // 미션 회차
  startDate: string;
  endDate: string;
  challengeOptionCode: string;
  url: string;
}

const data = [
  {
    id: 1,
    title: '첫 번째 미션',
    th: 1,
    startDate: '2024-03-01T00:00:00',
    endDate: '2024-03-07T23:59:59',
    challengeOptionCode: 'FEEDBACK_A',
  },
  {
    id: 2,
    title: '두 번째 미션',
    th: 2,
    startDate: '2024-03-08T00:00:00',
    endDate: '2024-03-14T23:59:59',
    challengeOptionCode: 'FEEDBACK_B',
  },
  {
    id: 3,
    title: '세 번째 미션',
    th: 3,
    startDate: '2024-03-15T00:00:00',
    endDate: '2024-03-21T23:59:59',
    challengeOptionCode: 'FEEDBACK_C',
  },
];

const columns: GridColDef<Row>[] = [
  {
    field: 'title',
    headerName: '미션 명',
    width: 200,
  },
  {
    field: 'th',
    headerName: '미션 회차',
    type: 'number',
    width: 100,
  },
  {
    field: 'startDate',
    headerName: '공개일',
    width: 200,
    sortable: false,
    renderCell: (params: GridRenderCellParams<Row, string>) =>
      dayjs(params.value).format(LOCALIZED_YYYY_MD_Hm),
  },
  {
    field: 'endDate',
    headerName: '마감일',
    sortable: false,
    width: 200,
    renderCell: (params: GridRenderCellParams<Row, string>) =>
      dayjs(params.value).format(LOCALIZED_YYYY_MD_Hm),
  },
  {
    field: 'challengeOptionCode',
    headerName: '피드백 옵션',
    sortable: false,
    width: 200,
  },
  {
    field: 'url',
    headerName: '피드백 페이지',
    width: 120,
    renderCell: (params: GridRenderCellParams<Row, string>) => (
      <Link
        to={params.value || '#'}
        className="text-primary underline"
        onClick={() => {
          // 선택한 행 정보 저장
          localStorage.setItem('mission', JSON.stringify(params.row));
        }}
      >
        바로가기
      </Link>
    ),
  },
];

const useFeedbackMissionRows = () => {
  const { programId } = useParams();

  const { data } = useChallengeMissionFeedbackQuery(Number(programId));

  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    if (!data) return;

    setRows(
      data.missionList.map((item) => ({
        ...item,
        title: item.title ?? '',
        challengeOptionCode: item.challengeOptionCode ?? '',
        url: `/admin/challenge/operation/${programId}/feedback/mission/${item.id}/participants`,
      })),
    );
  }, [data, programId]);

  return rows;
};

function ChallengeOperationFeedbackPage() {
  const rows = useFeedbackMissionRows();

  useEffect(() => {
    localStorage.removeItem('mission');
  }, []);

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      disableRowSelectionOnClick
      hideFooter
    />
  );
}

export default ChallengeOperationFeedbackPage;
