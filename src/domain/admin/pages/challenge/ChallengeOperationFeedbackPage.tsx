'use client';

import {
  useChallengeMissionFeedbackListQuery,
  useMentorMissionFeedbackListQuery,
  useGetChallengeAttendances,
} from '@/api/challenge/challenge';
import { useIsAdminQuery } from '@/api/user/user';
import { LOCALIZED_YYYY_MD_Hm } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import MentorMenteeAssignment from './MentorMenteeAssignment';

interface Row {
  id: number | string;
  title?: string | null;
  th: number;
  startDate: string;
  endDate: string;
  challengeOptionCode?: string | null;
  challengeOptionTitle?: string | null;
  url: string;
}

// ─── 제출 수 셀 ─────────────────────────────────────────────

function SubmissionCountCell({ missionId }: { missionId: number | string }) {
  const { programId } = useParams<{ programId: string }>();
  const { data: isAdmin } = useIsAdminQuery();

  const { data: adminAttendances } = useGetChallengeAttendances({
    challengeId: isAdmin === true ? Number(programId) : undefined,
    detailedMissionId: isAdmin === true ? Number(missionId) : undefined,
  });

  if (isAdmin) {
    const list = adminAttendances ?? [];
    const submitted = list.filter((a) => !!a.attendance.link).length;
    return (
      <span>
        {submitted} / {list.length}
      </span>
    );
  }

  return <span className="text-neutral-40">-</span>;
}

// ─── Hooks ──────────────────────────────────────────────────

const useFeedbackMissionRows = (): Row[] => {
  const { programId } = useParams<{ programId: string }>();
  const { data: isAdmin } = useIsAdminQuery();
  const { data: dataForAdmin } = useChallengeMissionFeedbackListQuery(
    Number(programId),
    { enabled: !!programId && (isAdmin === true) },
  );
  const { data: dataForMentor } = useMentorMissionFeedbackListQuery(
    Number(programId),
    { enabled: !!programId && (isAdmin === false) },
  );

  const data = isAdmin ? dataForAdmin : dataForMentor;

  return useMemo(
    () =>
      (data?.missionList ?? []).map((item) => ({
        ...item,
        url: `/admin/challenge/operation/${programId}/feedback/mission/${item.id}/participants`,
      })),
    [data, programId],
  );
};

// ─── 메인 페이지 ────────────────────────────────────────────

function ChallengeOperationFeedbackPage() {
  const rows = useFeedbackMissionRows();

  const columns: GridColDef<Row>[] = useMemo(
    () => [
      { field: 'title', headerName: '미션 명', flex: 1, minWidth: 180 },
      { field: 'th', headerName: '미션 회차', type: 'number', width: 90 },
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
        width: 180,
      },
      {
        field: 'submissionCount',
        headerName: '제출 / 전체',
        width: 120,
        sortable: false,
        renderCell: (params: GridRenderCellParams<Row>) => (
          <SubmissionCountCell missionId={params.row.id} />
        ),
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
              localStorage.setItem('mission', JSON.stringify(params.row));
            }}
          >
            바로가기
          </Link>
        ),
      },
      {
        field: 'feedbackPeriod',
        headerName: '피드백 마감기간',
        width: 200,
        sortable: false,
        renderCell: (params: GridRenderCellParams<Row>) => {
          const endDate = params.row.endDate;
          if (!endDate) return '-';
          const feedbackDeadline = dayjs(endDate).add(3, 'day');
          return (
            <span className="font-semibold">
              {feedbackDeadline.format('YYYY년 M월 D일')}
            </span>
          );
        },
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-4">
      {/* 탭 */}
      <div className="flex items-center gap-2">
        <span className="rounded-md border border-neutral-0 bg-neutral-0 px-4 py-2 text-xsmall14 font-medium text-white">
          피드백 관리
        </span>
      </div>

      <MentorMenteeAssignment />

      <h3 className="mt-4 text-medium18 font-semibold">피드백 미션</h3>
      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        hideFooter
        sx={{ '& .MuiDataGrid-cell': { overflow: 'visible' } }}
      />
    </div>
  );
}

export default ChallengeOperationFeedbackPage;
