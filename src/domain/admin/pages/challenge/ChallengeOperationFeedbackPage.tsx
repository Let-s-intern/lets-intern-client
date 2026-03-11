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
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  mentorId: number | null;
  mentorName: string | null;
  missionTitle: string;
  missionRound: number | string;
  name: string;
  major?: string | null;
  wishJob?: string | null;
  wishCompany?: string | null;
  wishIndustry?: string | null;
  link?: string | null;
  feedbackPageLink: string;
  feedbackStatus: string;
}

// ─── Hooks ──────────────────────────────────────────────────

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
  const [rows, setRows] = useState<MissionRow[]>([]);

  useEffect(() => {
    if (isLoading || !dataForAdmin || !dataForMentor) return;
    setRows(
      (isAdmin ? dataForAdmin : dataForMentor).missionList
        .filter((item) => !!item.challengeOptionTitle)
        .map((item) => ({
          ...item,
        })),
    );
  }, [dataForAdmin, isAdmin, isLoading, dataForMentor]);

  return rows;
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

  const handleChange = async (e: SelectChangeEvent<number>) => {
    await patchAttendance({
      attendanceId: row.id,
      mentorUserId: e.target.value as number,
    });
    await invalidate();
  };

  if (!isAdmin) return <span>{row.mentorName}</span>;

  return (
    <SelectFormControl<number>
      value={row.mentorId ?? NO_MENTOR_ID}
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

// ─── Breadcrumb ─────────────────────────────────────────────

function Breadcrumb({
  items,
  onNavigate,
}: {
  items: { label: string; onClick?: () => void }[];
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex items-center gap-1 text-xsmall14">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-neutral-60">{'>'}</span>}
            {isLast ? (
              <span className="font-semibold text-neutral-0">{item.label}</span>
            ) : (
              <button
                type="button"
                className="text-neutral-40 hover:text-neutral-0 hover:underline"
                onClick={() => {
                  item.onClick?.();
                  onNavigate?.();
                }}
              >
                {item.label}
              </button>
            )}
          </span>
        );
      })}
    </nav>
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
    enabled: !!programId && !!missionId && isAdmin,
  });
  const { data: dataForMentor } = useMentorMissionFeedbackAttendanceQuery({
    challengeId: programId,
    missionId,
    enabled: !!programId && !!missionId && !isAdmin,
  });

  const data = isAdmin ? dataForAdmin : dataForMentor;

  const rows: AttendanceRow[] = useMemo(
    () =>
      (data?.attendanceList ?? []).map((item) => {
        const { status, result, challengePricePlanType, ...rest } = item;
        return {
          ...rest,
          missionTitle: mission.title ?? '',
          missionRound: mission.th,
          feedbackStatus:
            item.feedbackStatus ?? FeedbackStatusEnum.enum.WAITING,
          feedbackPageLink: `/admin/challenge/operation/${programId}/mission/${missionId}/participant/${item.id}/feedback`,
        };
      }),
    [data, mission, programId, missionId],
  );

  const attendanceColumns: GridColDef<AttendanceRow>[] = useMemo(
    () => [
      {
        field: 'mentorId',
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

  const handleBackToMissionList = useCallback(() => {
    setSelectedMission(null);
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
