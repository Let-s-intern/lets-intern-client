'use client';

import {
  useChallengeMissionFeedbackListQuery,
  useMentorMissionFeedbackListQuery,
} from '@/api/challenge/challenge';
import { useIsAdminQuery } from '@/api/user/user';
import { LOCALIZED_YYYY_MD_Hm } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Row {
  id: number | string;
  title?: string | null;
  th: number; // 미션 회차
  startDate: string;
  endDate: string;
  challengeOptionCode?: string | null;
  challengeOptionTitle?: string | null;
  url: string;
}

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
    field: 'challengeOptionTitle',
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
        href={params.value || '#'}
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
  const { programId } = useParams<{ programId: string }>();

  const { data: isAdmin } = useIsAdminQuery();
  const { data: dataForAdmin, isLoading: isAdminLoading } =
    useChallengeMissionFeedbackListQuery(Number(programId), {
      enabled: !!programId && isAdmin,
    });
  const { data: dataForMentor, isLoading: isMentorLoading } =
    useMentorMissionFeedbackListQuery(Number(programId), {
      enabled: !!programId && !isAdmin,
    });

  const isLoading = isAdminLoading || isMentorLoading;

  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    if (isLoading || !dataForAdmin || !dataForMentor) return;

    setRows(
      (isAdmin ? dataForAdmin : dataForMentor).missionList.map((item) => ({
        ...item,
        url: `/admin/challenge/operation/${programId}/feedback/mission/${item.id}/participants`,
      })),
    );
  }, [dataForAdmin, isAdmin, isLoading, dataForMentor, programId]);

  return rows;
};

function ChallengeOperationFeedbackPage() {
  const rows = useFeedbackMissionRows();

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
