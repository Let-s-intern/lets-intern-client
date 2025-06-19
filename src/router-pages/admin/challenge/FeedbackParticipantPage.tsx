/** 챌린지 운영 > 피드백 > 미션별 참여자 페이지
 * @todo API 연결: /api/v2/admin/challenge/{challengeId}/mission/{missionId}/feedback/attendances
 */

import { usePatchAttendance } from '@/api/attendance';
import {
  ChallengeMissionFeedbackAttendanceQueryKey,
  useChallengeMissionFeedbackAttendanceQuery,
} from '@/api/challenge';
import {
  FeedbackStatus,
  FeedbackStatusEnum,
  FeedbackStatusMapping,
} from '@/api/challengeSchema';
import { useAdminChallengeMentorListQuery } from '@/api/mentor';
import SelectFormControl from '@components/admin/program/SelectFormControl';
import { MenuItem, SelectChangeEvent } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

interface Row {
  id: number | string;
  mentorName: string | null;
  missionTitle: string;
  missionRound: number | string;
  name: string;
  major?: string | null;
  wishJob?: string | null;
  wishCompany?: string | null;
  link?: string | null;
  feedbackPageLink: string;
  feedbackStatus: string;
}

const MentorRenderCell = (params: GridRenderCellParams<Row, number>) => {
  const { programId } = useParams();
  const { data } = useAdminChallengeMentorListQuery(programId);

  return (
    <SelectFormControl<number>
      value={params.value}
      renderValue={(selected) => {
        const target = data?.mentorList.find(
          (item) => item.userId === selected,
        );
        return target?.name || '없음';
      }}
    >
      <MenuItem value={0}>없음</MenuItem>
      {(data?.mentorList ?? []).map((item) => (
        <MenuItem
          key={`mentor-${item.challengeMentorId}`}
          value={item.userId}
        >{`[${item.userId}] ${item.name}`}</MenuItem>
      ))}
    </SelectFormControl>
  );
};

const FeedbackStatusRenderCell = (
  params: GridRenderCellParams<Row, FeedbackStatus>,
) => {
  const client = useQueryClient();
  const { missionId, programId } = useParams();

  const patchAttendance = usePatchAttendance();

  const handleChange = async (e: SelectChangeEvent<FeedbackStatus>) => {
    const attendanceId = params.row.id;
    await patchAttendance.mutateAsync({
      attendanceId,
      feedbackStatus: e.target.value as FeedbackStatus,
    });
    client.invalidateQueries({
      queryKey: [
        ChallengeMissionFeedbackAttendanceQueryKey,
        programId,
        missionId,
      ],
    });
  };

  return (
    <SelectFormControl<FeedbackStatus>
      value={params.value || FeedbackStatusEnum.enum.WAITING}
      renderValue={(selected) => FeedbackStatusMapping[selected]}
      onChange={handleChange}
    >
      {/* todo: 멘토/관리자에 따라 수정 권한 제어 */}
      {FeedbackStatusEnum.options.map((item) => (
        <MenuItem key={item} value={item}>
          {FeedbackStatusMapping[item]}{' '}
        </MenuItem>
      ))}
    </SelectFormControl>
  );
};

const columns: GridColDef<Row>[] = [
  {
    field: 'mentorName',
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
    renderCell: (params: GridRenderCellParams<Row, string>) => (
      <Link
        to={params.value || '#'}
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
    renderCell: (params: GridRenderCellParams<Row, string>) => (
      <Link
        to={params.value || '#'}
        className="text-primary underline"
        onClick={() => {
          localStorage.setItem('attendance', JSON.stringify(params.row)); // 선택한 행 정보 저장
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
];

const useFeedbackParticipantRows = () => {
  const { missionId, programId } = useParams();

  const { data } = useChallengeMissionFeedbackAttendanceQuery({
    challengeId: programId,
    missionId,
  });

  const [rows, setRows] = useState<Row[]>([]);

  const selectedMission = JSON.parse(localStorage.getItem('mission') ?? '{}');
  const missionTitle = selectedMission.title;
  const missionRound = selectedMission.th;

  useEffect(() => {
    setRows(
      (data?.attendanceList ?? []).map((item) => {
        const { status, result, challengePricePlanType, ...rest } = item; // eslint-disable-line @typescript-eslint/no-unused-vars
        return {
          ...rest,
          missionTitle,
          missionRound,
          feedbackStatus:
            item.feedbackStatus ?? FeedbackStatusEnum.enum.WAITING,
          feedbackPageLink: `/admin/challenge/operation/${programId}/mission/${missionId}/participant/${item.id}/feedback`,
        };
      }),
    );
  }, [data, missionTitle, missionRound, programId, missionId]);

  return rows;
};

export default function FeedbackParticipantPage() {
  const rows = useFeedbackParticipantRows();

  useEffect(() => {
    localStorage.removeItem('attendance');
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
