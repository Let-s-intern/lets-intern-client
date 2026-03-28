'use client';

import {
  ChallengeMissionFeedbackAttendanceQueryKey,
  MentorMissionFeedbackAttendanceQueryKey,
  useChallengeMissionFeedbackAttendanceQuery,
  useChallengeMissionFeedbackListQuery,
  useMentorMissionFeedbackAttendanceQuery,
  useMentorMissionFeedbackListQuery,
} from '@/api/challenge/challenge';
import {
  FeedbackStatus,
  FeedbackStatusEnum,
  FeedbackStatusMapping,
} from '@/api/challenge/challengeSchema';
import {
  usePatchAdminAttendance,
  usePatchAttendanceMentor,
} from '@/api/attendance/attendance';
import { useAdminChallengeMentorListQuery } from '@/api/mentor/mentor';
import { useIsAdminQuery } from '@/api/user/user';
import SelectFormControl from '@/domain/admin/program/SelectFormControl';
import useInvalidateQueries from '@/hooks/useInvalidateQueries';
import { LOCALIZED_YYYY_MD_Hm } from '@/data/dayjsFormat';
import dayjs from '@/lib/dayjs';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { MenuItem, SelectChangeEvent } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import MentorMenteeAssignment from './MentorMenteeAssignment';

type SubTab = 'mentorMentee' | 'feedbackManage';

// ─── 피드백 관리: 미션 목록 ─────────────────────────────────

interface MissionRow {
  id: number | string;
  title?: string | null;
  th: number;
  startDate: string;
  endDate: string;
  challengeOptionCode?: string | null;
  challengeOptionTitle?: string | null;
}

// ─── 피드백 관리: 제출 현황 ─────────────────────────────────

interface AttendanceRow {
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

// ─── Hooks ──────────────────────────────────────────────────

const useFeedbackMissionRows = (): MissionRow[] => {
  const { programId } = useParams<{ programId: string }>();
  const { data: isAdmin } = useIsAdminQuery();
  const { data: dataForAdmin } =
    useChallengeMissionFeedbackListQuery(Number(programId), {
      enabled: !!programId && isAdmin === true,
    });
  const { data: dataForMentor } =
    useMentorMissionFeedbackListQuery(Number(programId), {
      enabled: !!programId && isAdmin === false,
    });

  const data = isAdmin ? dataForAdmin : dataForMentor;

  return useMemo(
    () =>
      (data?.missionList ?? []).map((item) => ({ ...item })),
    [data],
  );
};

const NO_MENTOR_ID = 0;
const FeedbackStatusEnumForMentor = FeedbackStatusEnum.exclude(['CONFIRMED']);

// ─── 제출 현황 셀 컴포넌트 ──────────────────────────────────

function MentorCell({
  row,
  programId,
  missionId,
}: {
  row: AttendanceRow;
  programId: string;
  missionId: string;
}) {
  const { data: isAdmin } = useIsAdminQuery();
  const { data: mentorData } = useAdminChallengeMentorListQuery(programId);
  const { mutateAsync: patchAdminAttendance } = usePatchAdminAttendance();
  const { mutateAsync: patchAttendanceMentor } = usePatchAttendanceMentor();

  const queryKey = isAdmin
    ? [ChallengeMissionFeedbackAttendanceQueryKey, programId, missionId]
    : [MentorMissionFeedbackAttendanceQueryKey, programId, missionId];
  const invalidate = useInvalidateQueries(queryKey);

  const patchAttendance = isAdmin ? patchAdminAttendance : patchAttendanceMentor;

  const queryClient = useQueryClient();
  const handleChange = async (e: SelectChangeEvent<number>) => {
    await patchAttendance({
      attendanceId: row.id,
      mentorUserId: e.target.value as number,
    });
    await invalidate();
    // 멘토/멘티 배정 탭과 동기화
    queryClient.invalidateQueries({
      queryKey: [ChallengeMissionFeedbackAttendanceQueryKey],
    });
  };

  if (!isAdmin) return <span>{row.mentorName}</span>;

  // challengeMentorId → userId 변환 (PATCH API는 userId를 필요로 함)
  const currentMentor = row.challengeMentorId != null
    ? (mentorData?.mentorList.find((item) => item.challengeMentorId === row.challengeMentorId)
      ?? mentorData?.mentorList.find((item) => item.userId === row.challengeMentorId))
    : undefined;

  return (
    <SelectFormControl<number>
      value={currentMentor?.userId ?? NO_MENTOR_ID}
      onChange={handleChange}
      renderValue={(selected) => {
        const target = mentorData?.mentorList.find(
          (item) => item.userId === selected,
        );
        return target?.name || '없음';
      }}
    >
      <MenuItem value={NO_MENTOR_ID}>없음</MenuItem>
      {(mentorData?.mentorList ?? []).map((item) => (
        <MenuItem
          key={`mentor-${item.challengeMentorId}`}
          value={item.userId}
        >{`[${item.userId}] ${item.name}`}</MenuItem>
      ))}
    </SelectFormControl>
  );
}

function FeedbackStatusCell({
  row,
  programId,
  missionId,
}: {
  row: AttendanceRow;
  programId: string;
  missionId: string;
}) {
  const { data: isAdmin } = useIsAdminQuery();
  const { mutateAsync: patchAdminAttendance } = usePatchAdminAttendance();
  const { mutateAsync: patchAttendanceMentor } = usePatchAttendanceMentor();

  const queryKey = isAdmin
    ? [ChallengeMissionFeedbackAttendanceQueryKey, programId, missionId]
    : [MentorMissionFeedbackAttendanceQueryKey, programId, missionId];
  const invalidate = useInvalidateQueries(queryKey);

  const patchAttendance = isAdmin ? patchAdminAttendance : patchAttendanceMentor;

  const handleChange = async (e: SelectChangeEvent<FeedbackStatus>) => {
    await patchAttendance({
      attendanceId: row.id,
      feedbackStatus: e.target.value as FeedbackStatus,
    });
    await invalidate();
  };

  const value = (row.feedbackStatus as FeedbackStatus) || FeedbackStatusEnum.enum.WAITING;

  if (!isAdmin && value === FeedbackStatusEnum.enum.CONFIRMED) {
    return <span>{FeedbackStatusMapping[value]}</span>;
  }

  return (
    <SelectFormControl<FeedbackStatus>
      value={value}
      renderValue={(selected) => FeedbackStatusMapping[selected]}
      onChange={handleChange}
    >
      {(isAdmin ? FeedbackStatusEnum : FeedbackStatusEnumForMentor).options.map(
        (item) => (
          <MenuItem key={item} value={item}>
            {FeedbackStatusMapping[item]}
          </MenuItem>
        ),
      )}
    </SelectFormControl>
  );
}

// ─── 제출 수 셀 ─────────────────────────────────────────────

function SubmissionCountCell({ missionId }: { missionId: number | string }) {
  const { programId } = useParams<{ programId: string }>();
  const { data: isAdmin } = useIsAdminQuery();

  const { data: dataForAdmin } = useChallengeMissionFeedbackAttendanceQuery({
    challengeId: programId,
    missionId: String(missionId),
    enabled: !!programId && isAdmin === true,
  });
  const { data: dataForMentor } = useMentorMissionFeedbackAttendanceQuery({
    challengeId: programId,
    missionId: String(missionId),
    enabled: !!programId && isAdmin === false,
  });

  const data = isAdmin ? dataForAdmin : dataForMentor;
  const submitted = data?.attendanceList?.filter((a) => !!a.link)?.length ?? 0;
  const confirmed =
    data?.attendanceList?.filter((a) => a.feedbackStatus === 'CONFIRMED')
      ?.length ?? 0;

  if (!data) return <span className="text-neutral-40">-</span>;

  return (
    <span>
      {submitted} / {confirmed}
    </span>
  );
}

// ─── 미션 목록 테이블 ───────────────────────────────────────

function FeedbackMissionList({
  onSelectMission,
}: {
  onSelectMission: (mission: MissionRow) => void;
}) {
  const rows = useFeedbackMissionRows();

  const missionColumns: GridColDef<MissionRow>[] = useMemo(
    () => [
      { field: 'title', headerName: '미션 명', flex: 1, minWidth: 180 },
      { field: 'th', headerName: '미션 회차', type: 'number', width: 90 },
      {
        field: 'startDate',
        headerName: '공개일',
        width: 200,
        sortable: false,
        renderCell: (params: GridRenderCellParams<MissionRow, string>) =>
          dayjs(params.value).format(LOCALIZED_YYYY_MD_Hm),
      },
      {
        field: 'endDate',
        headerName: '마감일',
        sortable: false,
        width: 200,
        renderCell: (params: GridRenderCellParams<MissionRow, string>) =>
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
        headerName: '제출 / 확인완료',
        width: 120,
        sortable: false,
        renderCell: (params: GridRenderCellParams<MissionRow>) => (
          <SubmissionCountCell missionId={params.row.id} />
        ),
      },
      {
        field: 'feedbackPage',
        headerName: '피드백 페이지',
        width: 110,
        sortable: false,
        renderCell: (params: GridRenderCellParams<MissionRow>) => (
          <button
            type="button"
            className="text-primary underline"
            onClick={() => onSelectMission(params.row)}
          >
            바로가기
          </button>
        ),
      },
      {
        field: 'feedbackPeriod',
        headerName: '피드백 마감기간',
        width: 200,
        sortable: false,
        renderCell: (params: GridRenderCellParams<MissionRow>) => {
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
    [onSelectMission],
  );

  return (
    <DataGrid
      rows={rows}
      columns={missionColumns}
      disableRowSelectionOnClick
      hideFooter
      sx={{ '& .MuiDataGrid-cell': { overflow: 'visible' } }}
    />
  );
}

// ─── 제출 현황 테이블 (인라인) ──────────────────────────────

function FeedbackAttendanceList({
  mission,
}: {
  mission: MissionRow;
}) {
  const { programId } = useParams<{ programId: string }>();
  const missionId = String(mission.id);

  const { data: isAdmin } = useIsAdminQuery();

  const { data: dataForAdmin } = useChallengeMissionFeedbackAttendanceQuery({
    challengeId: programId,
    missionId,
    enabled: !!programId && !!missionId && isAdmin === true,
  });
  const { data: dataForMentor } = useMentorMissionFeedbackAttendanceQuery({
    challengeId: programId,
    missionId,
    enabled: !!programId && !!missionId && isAdmin === false,
  });

  const data = isAdmin ? dataForAdmin : dataForMentor;

  const rows: AttendanceRow[] = useMemo(
    () =>
      (data?.attendanceList ?? []).map(
        ({ status: _s, result: _r, challengePricePlanType: _c, ...rest }) => ({
          ...rest,
          missionTitle: mission.title ?? '',
          missionRound: mission.th,
          feedbackStatus: rest.feedbackStatus ?? FeedbackStatusEnum.enum.WAITING,
          feedbackPageLink: `/admin/challenge/operation/${programId}/mission/${missionId}/participant/${rest.id}/feedback`,
        }),
      ),
    [data, mission, programId, missionId],
  );

  const attendanceColumns: GridColDef<AttendanceRow>[] = useMemo(
    () => [
      {
        field: 'challengeMentorId',
        headerName: '담당 멘토',
        width: 130,
        renderCell: (params: GridRenderCellParams<AttendanceRow>) => (
          <MentorCell
            row={params.row}
            programId={programId}
            missionId={missionId}
          />
        ),
      },
      { field: 'name', headerName: '이름', width: 100 },
      { field: 'major', headerName: '전공', width: 120 },
      { field: 'wishCompany', headerName: '희망 기업', width: 120 },
      { field: 'wishJob', headerName: '희망 직무', flex: 1, minWidth: 120 },
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
        headerName: '피드백 작성',
        width: 110,
        renderCell: (params: GridRenderCellParams<AttendanceRow, string>) => (
          <Link
            href={params.value || '#'}
            className="text-primary underline"
            onClick={() => {
              localStorage.setItem('mission', JSON.stringify(mission));
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
        width: 130,
        renderCell: (params: GridRenderCellParams<AttendanceRow>) => (
          <FeedbackStatusCell
            row={params.row}
            programId={programId}
            missionId={missionId}
          />
        ),
      },
    ],
    [programId, missionId, mission],
  );

  return (
    <DataGrid
      rows={rows}
      columns={attendanceColumns}
      disableRowSelectionOnClick
      hideFooter
      sx={{ '& .MuiDataGrid-cell': { overflow: 'visible' } }}
    />
  );
}

// ─── 메인 페이지 ────────────────────────────────────────────

function ChallengeOperationFeedbackPage() {
  const [activeTab, setActiveTab] = useState<SubTab>('feedbackManage');
  const [selectedMission, setSelectedMission] = useState<MissionRow | null>(
    null,
  );

  const handleSelectMission = useCallback((mission: MissionRow) => {
    setSelectedMission(mission);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* 하위 탭 버튼 */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={`rounded-md border px-4 py-2 text-xsmall14 font-medium transition-colors ${
            activeTab === 'mentorMentee'
              ? 'border-neutral-0 bg-neutral-0 text-white'
              : 'border-neutral-80 bg-white text-neutral-0 hover:bg-neutral-95'
          }`}
          onClick={() => {
            setActiveTab('mentorMentee');
            setSelectedMission(null);
          }}
        >
          멘토/멘티 배정
        </button>
        <button
          type="button"
          className={`rounded-md border px-4 py-2 text-xsmall14 font-medium transition-colors ${
            activeTab === 'feedbackManage' && !selectedMission
              ? 'border-neutral-0 bg-neutral-0 text-white'
              : 'border-neutral-80 bg-white text-neutral-0 hover:bg-neutral-95'
          }`}
          onClick={() => {
            setActiveTab('feedbackManage');
            setSelectedMission(null);
          }}
        >
          피드백 관리
        </button>
        {selectedMission && activeTab === 'feedbackManage' && (
          <button
            type="button"
            className="rounded-md border border-neutral-0 bg-neutral-0 px-4 py-2 text-xsmall14 font-medium text-white"
          >
            {selectedMission.title ?? '미션'} {selectedMission.th}회차 제출현황
          </button>
        )}
      </div>

      {/* 하위 탭 컨텐츠 */}
      {activeTab === 'mentorMentee' ? (
        <MentorMenteeAssignment />
      ) : selectedMission ? (
        <FeedbackAttendanceList mission={selectedMission} />
      ) : (
        <FeedbackMissionList onSelectMission={handleSelectMission} />
      )}
    </div>
  );
}

export default ChallengeOperationFeedbackPage;
