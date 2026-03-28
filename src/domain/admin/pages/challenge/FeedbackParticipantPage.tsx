'use client';

/** 챌린지 운영 > 피드백 > 미션별 참여자 페이지 */

import {
  usePatchAdminAttendance,
  usePatchAttendanceMentor,
} from '@/api/attendance/attendance';
import {
  ChallengeMissionFeedbackAttendanceQueryKey,
  MentorMissionFeedbackAttendanceQueryKey,
  useChallengeMissionFeedbackAttendanceQuery,
  useMentorMissionFeedbackAttendanceQuery,
  useGetChallengeAttendances,
} from '@/api/challenge/challenge';
import {
  FeedbackStatus,
  FeedbackStatusEnum,
  FeedbackStatusMapping,
} from '@/api/challenge/challengeSchema';
import { useAdminChallengeMentorListQuery } from '@/api/mentor/mentor';
import { useIsAdminQuery } from '@/api/user/user';
import SelectFormControl from '@/domain/admin/program/SelectFormControl';
import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import { useQueryClient } from '@tanstack/react-query';
import { MenuItem, SelectChangeEvent } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

const NO_MENTOR_ID = 0;

export interface AttendanceRow {
  id: number | string;
  userId?: number | null;
  challengeMentorId: number | null;
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
  const invalidateFeedback = useInvalidateQueries(queryKey);
  const queryClient = useQueryClient();

  const invalidateAttendance = async () => {
    await invalidateFeedback();
    // 일반 attendances 쿼리도 무효화 (fallback → 원본 전환을 위해)
    await queryClient.invalidateQueries({ queryKey: ['admin', 'challenge', Number(programId), 'attendances', Number(missionId)] });
  };

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

  // challengeMentorId → userId 변환 (PATCH API는 userId를 필요로 함)
  const currentMentor =
    params.value != null
      ? (data?.mentorList.find(
          (item) => item.challengeMentorId === params.value,
        ) ??
        data?.mentorList.find((item) => item.userId === params.value))
      : undefined;

  return (
    <SelectFormControl<number>
      value={currentMentor?.userId ?? NO_MENTOR_ID}
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

const useRoleBasedAttendanceData = () => {
  const { missionId, programId } = useParams<{
    missionId: string;
    programId: string;
  }>();

  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdminQuery();

  // 어드민: feedback/attendances 먼저 시도
  const { data: dataForAdmin } = useChallengeMissionFeedbackAttendanceQuery({
    challengeId: programId,
    missionId,
    enabled: !!programId && !!missionId && (isAdmin === true),
  });

  // 어드민: feedback/attendances가 빈 배열이면 일반 attendances fallback
  const feedbackEmpty = isAdmin === true && dataForAdmin != null && dataForAdmin.attendanceList.length === 0;
  const { data: fallbackData } = useGetChallengeAttendances({
    challengeId: feedbackEmpty ? Number(programId) : undefined,
    detailedMissionId: feedbackEmpty ? Number(missionId) : undefined,
  });

  const adminData = useMemo(() => {
    // feedback/attendances에 데이터가 있으면 그대로 사용
    if (dataForAdmin && dataForAdmin.attendanceList.length > 0) return dataForAdmin;
    // fallback: 일반 attendances → feedback 형식으로 변환
    if (fallbackData && fallbackData.length > 0) {
      return {
        attendanceList: fallbackData.map((item) => ({
          id: item.attendance.id,
          userId: item.attendance.userId ?? null,
          challengeMentorId: null as number | null,
          mentorId: null as number | null,
          mentorName: null as string | null,
          name: item.attendance.name ?? '',
          major: null as string | null,
          wishJob: null as string | null,
          wishCompany: null as string | null,
          link: item.attendance.link ?? null,
          status: (item.attendance.status ?? 'ABSENT') as 'PRESENT' | 'UPDATED' | 'LATE' | 'ABSENT',
          result: (item.attendance.result ?? 'WAITING') as 'WAITING' | 'PASS' | 'WRONG' | 'FINAL_WRONG',
          challengePricePlanType: ('BASIC') as 'LIGHT' | 'BASIC' | 'STANDARD' | 'PREMIUM',
          feedbackStatus: ('WAITING') as 'WAITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CONFIRMED' | null,
          optionCode: null as string | null,
        })),
      };
    }
    return dataForAdmin;
  }, [dataForAdmin, fallbackData]);

  const { data: dataForMentor } = useMentorMissionFeedbackAttendanceQuery({
    challengeId: programId,
    missionId,
    enabled: !!programId && !!missionId && (isAdmin === false),
  });

  return {
    isLoading: isAdminLoading,
    data: isAdmin ? adminData : dataForMentor,
  };
};

const useSelectedMission = () => {
  return useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('mission') || '{}');
    } catch {
      return {};
    }
  }, []);
};

const useFeedbackParticipantRows = (): AttendanceRow[] => {
  const { missionId, programId } = useParams();
  const { data } = useRoleBasedAttendanceData();
  const selectedMission = useSelectedMission();

  return useMemo(
    () =>
      (data?.attendanceList ?? []).map(
        ({ status: _s, result: _r, challengePricePlanType: _c, ...rest }) => ({
          ...rest,
          missionTitle: selectedMission.title ?? '',
          missionRound: selectedMission.th ?? '',
          feedbackStatus:
            (rest.feedbackStatus as string) ??
            FeedbackStatusEnum.enum.WAITING,
          feedbackPageLink: `/admin/challenge/operation/${programId}/mission/${missionId}/participant/${rest.id}/feedback`,
        }),
      ),
    [data, selectedMission, programId, missionId],
  );
};

export default function FeedbackParticipantPage() {
  const { missionId, programId } = useParams<{
    missionId: string;
    programId: string;
  }>();
  const rows = useFeedbackParticipantRows();
  const selectedMission = useSelectedMission();

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
        <Link
          href={`/admin/challenge/operation/${programId}/feedback`}
          className="rounded-md border border-neutral-80 bg-white px-4 py-2 text-xsmall14 font-medium text-neutral-0 hover:bg-neutral-95"
        >
          멘토/멘티 배정
        </Link>
        <Link
          href={`/admin/challenge/operation/${programId}/feedback`}
          className="rounded-md border border-neutral-80 bg-white px-4 py-2 text-xsmall14 font-medium text-neutral-0 hover:bg-neutral-95"
        >
          피드백 관리
        </Link>
        <span className="rounded-md border border-neutral-0 bg-neutral-0 px-4 py-2 text-xsmall14 font-medium text-white">
          {selectedMission.title ?? '미션'} {selectedMission.th ?? ''}회차
          제출현황
        </span>
      </div>

      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        hideFooter
      />
    </div>
  );
}
