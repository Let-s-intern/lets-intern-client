/** 챌린지 운영 > 피드백 > 미션별 참여자 페이지 */

import {
  usePatchAdminAttendance,
  usePatchAttendanceMentor,
} from '@/api/attendance';
import {
  ChallengeMissionFeedbackAttendanceQueryKey,
  MentorMissionFeedbackAttendanceQueryKey,
  useChallengeMissionFeedbackAttendanceQuery,
  useMentorMissionFeedbackAttendanceQuery,
} from '@/api/challenge';
import {
  FeedbackStatus,
  FeedbackStatusEnum,
  FeedbackStatusMapping,
} from '@/api/challengeSchema';
import { useAdminChallengeMentorListQuery } from '@/api/mentor';
import { useIsAdminQuery } from '@/api/user';
import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import SelectFormControl from '@components/admin/program/SelectFormControl';
import { MenuItem, SelectChangeEvent } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const NO_MENTOR_ID = 0;

export interface AttendanceRow {
  id: number | string;
  mentorId: number | null;
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

const FeedbackStatusEnumForMentor = FeedbackStatusEnum.exclude(['CONFIRMED']);

const useAttendanceHandler = () => {
  const { programId, missionId } = useParams<{
    programId: string;
    missionId: string;
  }>();
  const { data: isAdmin } = useIsAdminQuery();

  const queryKey = isAdmin
    ? [ChallengeMissionFeedbackAttendanceQueryKey, programId, missionId]
    : [MentorMissionFeedbackAttendanceQueryKey, programId, missionId];

  const { mutateAsync: patchAdminAttendance } = usePatchAdminAttendance();
  const { mutateAsync: patchAttendanceMentor } = usePatchAttendanceMentor();
  const invalidateAttendance = useInvalidateQueries(queryKey);

  return {
    patchAttendance: isAdmin ? patchAdminAttendance : patchAttendanceMentor,
    invalidateAttendance,
  };
};

const MentorRenderCell = (
  params: GridRenderCellParams<AttendanceRow, number>,
) => {
  const { programId } = useParams<{ programId: string }>();

  const { patchAttendance, invalidateAttendance } = useAttendanceHandler();

  const { data: isAdmin } = useIsAdminQuery();
  const { data } = useAdminChallengeMentorListQuery(programId);

  const handleChange = async (e: SelectChangeEvent<number>) => {
    const attendanceId = params.row.id;
    await patchAttendance({
      attendanceId,
      mentorUserId: e.target.value as number,
    });
    await invalidateAttendance();
  };

  if (!isAdmin) return <span>{params.row.mentorName}</span>;

  return (
    <SelectFormControl<number>
      value={params.value}
      onChange={handleChange}
      renderValue={(selected) => {
        const target = data?.mentorList.find(
          (item) => item.userId === selected,
        );
        return target?.name || '없음';
      }}
    >
      <MenuItem value={NO_MENTOR_ID}>없음</MenuItem>
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
  params: GridRenderCellParams<AttendanceRow, FeedbackStatus>,
) => {
  const { data: isAdmin } = useIsAdminQuery();
  const { patchAttendance, invalidateAttendance } = useAttendanceHandler();

  const handleChange = async (e: SelectChangeEvent<FeedbackStatus>) => {
    const attendanceId = params.row.id;

    await patchAttendance({
      attendanceId,
      feedbackStatus: e.target.value as FeedbackStatus,
    });
    await invalidateAttendance();
  };

  if (!isAdmin && params.value === FeedbackStatusEnum.enum.CONFIRMED) {
    return <span> {FeedbackStatusMapping[params.value]}</span>;
  }

  return (
    <SelectFormControl<FeedbackStatus>
      value={params.value || FeedbackStatusEnum.enum.WAITING}
      renderValue={(selected) => FeedbackStatusMapping[selected]}
      onChange={handleChange}
    >
      {(isAdmin ? FeedbackStatusEnum : FeedbackStatusEnumForMentor).options.map(
        (item) => (
          <MenuItem key={item} value={item}>
            {FeedbackStatusMapping[item]}{' '}
          </MenuItem>
        ),
      )}
    </SelectFormControl>
  );
};

const columns: GridColDef<AttendanceRow>[] = [
  {
    field: 'mentorId',
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
        href={params.value || '#'}
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

const useRoleBasedAttendanceData = () => {
  const { missionId, programId } = useParams<{
    missionId: string;
    programId: string;
  }>();

  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdminQuery();

  const { data: dataForAdmin } = useChallengeMissionFeedbackAttendanceQuery({
    challengeId: programId,
    missionId,
    enabled: !!programId && !!missionId && isAdmin,
  });

  const { data: dataForMentor } = useMentorMissionFeedbackAttendanceQuery({
    challengeId: programId,
    missionId,
    enabled: !!programId && !!missionId && !isAdmin,
  });

  return {
    isLoading: isAdminLoading,
    data: isAdmin ? dataForAdmin : dataForMentor,
  };
};

const useFeedbackParticipantRows = () => {
  const { missionId, programId } = useParams();

  const { data, isLoading } = useRoleBasedAttendanceData();

  const [rows, setRows] = useState<AttendanceRow[]>([]);

  const selectedMission = JSON.parse(localStorage.getItem('mission') || '{}');
  const missionTitle = selectedMission.title;
  const missionRound = selectedMission.th;

  useEffect(() => {
    if (isLoading) return;

    setRows(
      (data?.attendanceList ?? []).map((item) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { status, result, challengePricePlanType, ...rest } = item;

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
  }, [isLoading, data, missionTitle, missionRound, programId, missionId]);

  return rows;
};

export default function FeedbackParticipantPage() {
  const rows = useFeedbackParticipantRows();

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      disableRowSelectionOnClick
      hideFooter
    />
  );
}
