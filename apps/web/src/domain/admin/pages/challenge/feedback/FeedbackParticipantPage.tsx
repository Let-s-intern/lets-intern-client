'use client';

/** 챌린지 운영 > 피드백 > 미션별 참여자 페이지 */

import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

import { useIsAdminQuery } from '@/api/user/user';
import MentorRenderCell from './ui/MentorRenderCell';
import FeedbackStatusRenderCell from './ui/FeedbackStatusRenderCell';
import useFeedbackParticipantRows, {
  useSelectedMission,
} from './hooks/useFeedbackParticipantRows';
import type { AttendanceRow } from './types';

export default function FeedbackParticipantPage() {
  const { missionId, programId } = useParams<{
    missionId: string;
    programId: string;
  }>();
  const rows = useFeedbackParticipantRows();
  const selectedMission = useSelectedMission();
  const { data: isAdmin } = useIsAdminQuery();

  const columns: GridColDef<AttendanceRow>[] = useMemo(
    () => [
      {
        field: 'challengeMentorId',
        headerName: '담당 멘토',
        type: 'number',
        width: 120,
        renderCell: MentorRenderCell,
      },
      {
        field: 'missionTitle',
        headerName: '미션 명',
        width: 160,
      },
      {
        field: 'missionRound',
        headerName: '미션 회차',
        width: 80,
      },
      {
        field: 'name',
        headerName: '이름',
        width: 100,
      },
      {
        field: 'major',
        headerName: '전공',
        width: 150,
      },
      {
        field: 'wishCompany',
        headerName: '희망 기업',
        width: 120,
      },
      {
        field: 'wishJob',
        headerName: '희망 직무',
        width: 150,
      },
      {
        field: 'link',
        headerName: '미션 제출 링크',
        width: 120,
        renderCell: (params: GridRenderCellParams<AttendanceRow, string>) => (
          <Link
            href={
              params.value ||
              `/admin/challenge/operation/${programId}/attendances/${missionId}/${params.row.userId}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            미션 링크
          </Link>
        ),
      },
      {
        field: 'feedbackPageLink',
        headerName: '피드백 페이지',
        width: 120,
        renderCell: (params: GridRenderCellParams<AttendanceRow, string>) => (
          <Link
            href={params.value || '#'}
            className="text-primary underline"
            onClick={() => {
              localStorage.setItem('attendance', JSON.stringify(params.row));
            }}
          >
            바로가기
          </Link>
        ),
      },
      {
        field: 'feedbackStatus',
        headerName: '진행 상태',
        width: 120,
        renderCell: FeedbackStatusRenderCell,
      },
    ],
    [missionId, programId],
  );

  return (
    <div className="flex flex-col gap-4">
      {/* 퀵메뉴 탭 */}
      <div className="flex items-center gap-2">
        {isAdmin && (
          <Link
            href={`/admin/challenge/operation/${programId}/feedback`}
            className="border-neutral-80 text-xsmall14 text-neutral-0 hover:bg-neutral-95 rounded-md border bg-white px-4 py-2 font-medium"
          >
            멘토/멘티 배정
          </Link>
        )}
        <Link
          href={`/admin/challenge/operation/${programId}/feedback`}
          className="border-neutral-80 text-xsmall14 text-neutral-0 hover:bg-neutral-95 rounded-md border bg-white px-4 py-2 font-medium"
        >
          피드백 관리
        </Link>
        <span className="border-neutral-0 bg-neutral-0 text-xsmall14 rounded-md border px-4 py-2 font-medium text-white">
          {selectedMission.title ?? '미션'} {selectedMission.th ?? ''}회차
          제출현황
        </span>
      </div>

      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        hideFooter
        getRowHeight={() => 'auto'}
        sx={{
          '& .MuiDataGrid-cell': {
            overflow: 'visible',
            whiteSpace: 'normal',
            lineHeight: '1.4',
            py: 1,
          },
        }}
      />
    </div>
  );
}
