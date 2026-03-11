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
import MentorMenteeAssignment from './MentorMenteeAssignment';

type SubTab = 'mentorMentee' | 'feedbackManage';

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
  {
    field: 'feedbackPeriod',
    headerName: '피드백 기간',
    width: 200,
    sortable: false,
    renderCell: (params: GridRenderCellParams<Row>) => {
      const endDate = params.row.endDate;
      if (!endDate) return '-';
      const feedbackEnd = dayjs(endDate).add(3, 'day');
      return (
        <span className="font-semibold">
          {dayjs(endDate).format(LOCALIZED_YYYY_MD_Hm)} ~ {feedbackEnd.format(LOCALIZED_YYYY_MD_Hm)}
        </span>
      );
    },
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

function FeedbackManageTable() {
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

function ChallengeOperationFeedbackPage() {
  const [activeTab, setActiveTab] = useState<SubTab>('feedbackManage');

  return (
    <div className="flex flex-col gap-4">
      {/* 하위 탭 버튼 */}
      <div className="flex gap-2">
        <button
          type="button"
          className={`rounded-md border px-4 py-2 text-xsmall14 font-medium transition-colors ${
            activeTab === 'mentorMentee'
              ? 'border-neutral-0 bg-neutral-0 text-white'
              : 'border-neutral-80 bg-white text-neutral-0 hover:bg-neutral-95'
          }`}
          onClick={() => setActiveTab('mentorMentee')}
        >
          멘토/멘티 배정
        </button>
        <button
          type="button"
          className={`rounded-md border px-4 py-2 text-xsmall14 font-medium transition-colors ${
            activeTab === 'feedbackManage'
              ? 'border-neutral-0 bg-neutral-0 text-white'
              : 'border-neutral-80 bg-white text-neutral-0 hover:bg-neutral-95'
          }`}
          onClick={() => setActiveTab('feedbackManage')}
        >
          피드백 관리
        </button>
      </div>

      {/* 하위 탭 컨텐츠 */}
      {activeTab === 'mentorMentee' ? (
        <MentorMenteeAssignment />
      ) : (
        <FeedbackManageTable />
      )}
    </div>
  );
}

export default ChallengeOperationFeedbackPage;
